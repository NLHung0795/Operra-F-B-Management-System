package com.operra.operra_identity_service.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.operra.operra_common.dto.request.IntrospectRequest;
import com.operra.operra_common.dto.response.IntrospectResponse;
import com.operra.operra_common.exception.AppException;
import com.operra.operra_common.exception.ErrorCode;
import com.operra.operra_identity_service.dto.request.AuthenticationRequest;
import com.operra.operra_identity_service.dto.request.LogoutRequest;
import com.operra.operra_identity_service.dto.request.RefreshRequest;
import com.operra.operra_identity_service.dto.response.AuthenticationResponse;
import com.operra.operra_identity_service.dto.response.RefreshResponse;
import com.operra.operra_identity_service.entity.InvalidatedToken;
import com.operra.operra_identity_service.entity.UserAccount;
import com.operra.operra_identity_service.repository.InvalidatedTokenRepository;
import com.operra.operra_identity_service.repository.UserAccountRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Objects;
import java.util.StringJoiner;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserAccountRepository userAccountRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    private long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    private long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        log.info("hung");
        UserAccount userAccount = userAccountRepository.findUserAccountByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(request.getPassword(), userAccount.getPassword());

        if(!authenticated){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(userAccount);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try{
            var signToken = verifyToken(request.getToken(), true);
            //nếu còn trong tgian refresh thì mới logout

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime.toInstant())
                    .build();

            invalidatedTokenRepository.save(invalidatedToken); // dua token vao table trong dtb de thuc hien logout
        }
        catch (AppException e){
            log.info("token already expired");
        }
    }

    public RefreshResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime.toInstant())
                .build();

        invalidatedTokenRepository.save(invalidatedToken);


        var username = signedJWT.getJWTClaimsSet().getSubject();

        var user = userAccountRepository.findUserAccountByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return RefreshResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    private String generateToken(UserAccount userAccount){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userAccount.getId())
                .issuer("hung")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(userAccount))
                .build();

        Payload payload =new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {

            throw new RuntimeException(e);
        }
    }

    private String buildScope(UserAccount userAccount){
        StringJoiner stringJoiner = new StringJoiner(" ");
        //StringJoiner là một class trong Java (java.util) dùng để nối nhiều chuỗi lại với nhau, có một delimiter (ký tự phân cách).

        if(!CollectionUtils.isEmpty(userAccount.getRoles())){ // CollectionUtils.isEmpty(...) (của Spring) để check danh sách null hoặc rỗng.
            userAccount.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_"+ role.getName());

                role.getPermissions().forEach(permission -> {
                    stringJoiner.add(permission.getName());
                });
            });
        }
        return stringJoiner.toString();
    }



    public IntrospectResponse introspect(IntrospectRequest request) throws ParseException, JOSEException {
        var token = request.getToken();
        boolean isValid = true;
        SignedJWT jwt = null;

        try{
            jwt = verifyToken(token, false); // ktra xem token con hieu luc ko
        }
        catch (AppException e){
            isValid = false;
        }

        return IntrospectResponse.builder()
                .userId(Objects.nonNull(jwt)
                        ? jwt.getJWTClaimsSet().getSubject()
                        :null
                )
                .valid(isValid)
                .build();
    }


    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes()); //cái máy để kiểm tra chữ ký JWT dựa vào secret.

        SignedJWT signedJWT = SignedJWT.parse(token);
        //parse() sẽ "xẻ" chuỗi này ra thành các phần riêng biệt để hệ thống có thể đọc được thông tin bên trong
        //nó sẽ "xẻ" chuỗi JWT (JSON Web Token) thành 3 phần chính dựa trên 2 dấu chấm . ngăn cách
        //.getJWTClaimsSet() thuộc về phần Payload (phần thân) của JWT.

        Date expiryTime = isRefresh
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli()) // tra ve tgian con trong refresh time ko
                :signedJWT.getJWTClaimsSet().getExpirationTime(); // tra ve tgian token con hieu luc hay ko

        var verified = signedJWT.verify(verifier); // kết quả kiểm tra (true nếu token thật và nguyên vẹn, false nếu bị giả mạo).

        if(!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }
}
