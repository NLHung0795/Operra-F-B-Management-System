import React, { useState, useEffect } from 'react';
import { 
  Coffee, Search, Plus, Minus, Trash2, CreditCard, User, Tag, 
  Banknote, Smartphone, ShoppingCart, X, 
  LayoutGrid, MessageSquare, ArrowRightLeft, Clock, MapPin, ChevronDown
} from 'lucide-react';

const CATEGORIES = ['Tất cả', 'Cà phê', 'Trà', 'Bánh', 'Khác'];

const MENU_ITEMS = [
  { id: 1, name: 'Cà phê Đen', price: 25000, category: 'Cà phê', image: 'https://images.unsplash.com/photo-1550133730-695473e544be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrJTIwY29mZmVlfGVufDF8fHx8MTc3NTQ2NTk3Mnww&ixlib=rb-4.1.0&q=80&w=400' },
  { id: 2, name: 'Cà phê Sữa', price: 29000, category: 'Cà phê', image: 'https://images.unsplash.com/photo-1544885935-98dd03b09034?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxrJTIwY29mZmVlfGVufDF8fHx8MTc3NTQ2NTk3Mnww&ixlib=rb-4.1.0&q=80&w=400' },
  { id: 3, name: 'Trà Đào Cam Sả', price: 45000, category: 'Trà', image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWF8ZW58MXx8fHwxNzc1NDY1OTcxfDA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: 4, name: 'Trà Vải', price: 40000, category: 'Trà', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWF8ZW58MXx8fHwxNzc1NDY1OTcxfDA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: 5, name: 'Bánh Sừng Trâu', price: 35000, category: 'Bánh', image: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnR8ZW58MXx8fHwxNzc1NDY1OTczfDA&ixlib=rb-4.1.0&q=80&w=400' },
  { id: 6, name: 'Bạc Xỉu', price: 32000, category: 'Cà phê', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWV8ZW58MXx8fHwxNzc1NDY1OTczfDA&ixlib=rb-4.1.0&q=80&w=400' },
];

const INITIAL_AREAS = [
  { id: 'a1', name: 'Tầng 1' },
  { id: 'a2', name: 'Tầng 2' },
  { id: 'a3', name: 'Sân vườn' },
];

const INITIAL_TABLES = [
  { id: 't1', name: 'Bàn 1', areaId: 'a1', status: 'occupied', seatedAt: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 't2', name: 'Bàn 2', areaId: 'a1', status: 'empty' },
  { id: 't3', name: 'Bàn 3', areaId: 'a1', status: 'empty' },
  { id: 't4', name: 'Bàn 4', areaId: 'a2', status: 'occupied', seatedAt: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 't5', name: 'Bàn 5', areaId: 'a2', status: 'empty' },
  { id: 't6', name: 'Bàn 6', areaId: 'a3', status: 'empty' },
];

interface OrderItem { id: number; name: string; price: number; qty: number; note: string; }

function getElapsedMinutes(dateStr: Date | string) {
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} phút`;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hrs}h ${mins}p`;
}

export function POSScreen() {
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const [activeTab, setActiveTab] = useState<'tables' | 'menu'>('tables');
  
  const [areas] = useState(INITIAL_AREAS);
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [activeArea, setActiveArea] = useState('a1');
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({
    't1': [ { id: 1, name: 'Cà phê Đen', price: 25000, qty: 2, note: '' }, { id: 5, name: 'Bánh Sừng Trâu', price: 35000, qty: 1, note: '' } ],
    't4': [ { id: 3, name: 'Trà Đào Cam Sả', price: 45000, qty: 1, note: '' } ]
  });

  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showEditTableModal, setShowEditTableModal] = useState(false);
  const [tableToEdit, setTableToEdit] = useState<any>(null);

  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Máy Pha Chế', text: 'Bàn 4 xong nước nhé', time: '10:30' },
    { sender: 'Thu Ngân', text: 'Ok, đã cho người mang ra', time: '10:32' },
  ]);

  const addToCart = (item: any) => {
    if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi order!");
      return;
    }
    
    setTables(tables.map(t => {
      if (t.id === selectedTable && t.status === 'empty') {
        return { ...t, status: 'occupied', seatedAt: new Date() };
      }
      return t;
    }));

    const currentCart = orders[selectedTable] || [];
    const existing = currentCart.find(c => c.id === item.id);
    
    let newCart;
    if (existing) {
      newCart = currentCart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
    } else {
      newCart = [...currentCart, { id: item.id, name: item.name, price: item.price, qty: 1, note: '' }];
    }
    
    setOrders({ ...orders, [selectedTable]: newCart });
  };

  const updateQty = (id: number, delta: number) => {
    if(!selectedTable) return;
    const currentCart = orders[selectedTable] || [];
    const newCart = currentCart.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : c;
      }
      return c;
    });
    setOrders({ ...orders, [selectedTable]: newCart });
  };

  const removeItem = (id: number) => {
    if(!selectedTable) return;
    const currentCart = orders[selectedTable] || [];
    setOrders({ ...orders, [selectedTable]: currentCart.filter(c => c.id !== id) });
  };

  const handleTransfer = (targetTableId: string) => {
    if (!selectedTable) return;
    
    const currentOrders = orders[selectedTable] || [];
    const targetOrders = orders[targetTableId] || [];
    
    const newOrders = { ...orders };
    newOrders[targetTableId] = [...targetOrders, ...currentOrders];
    delete newOrders[selectedTable];
    
    setOrders(newOrders);
    
    const currentSeatedAt = tables.find(t => t.id === selectedTable)?.seatedAt;
    
    setTables(tables.map(t => {
      if (t.id === selectedTable) {
        return { ...t, status: 'empty', seatedAt: undefined };
      }
      if (t.id === targetTableId) {
        return { ...t, status: 'occupied', seatedAt: t.status === 'empty' ? currentSeatedAt : t.seatedAt };
      }
      return t;
    }));
    
    setSelectedTable(targetTableId);
    setShowTransferModal(false);
  };

  const handlePayment = () => {
    if (!selectedTable) return;
    const newOrders = { ...orders };
    delete newOrders[selectedTable];
    setOrders(newOrders);
    
    setTables(tables.map(t => t.id === selectedTable ? { ...t, status: 'empty', seatedAt: undefined } : t));
    
    setShowPayment(false);
    alert("Thanh toán thành công! Hóa đơn đã được lưu.");
  };

  const openEditTableModal = (table: any) => {
    setTableToEdit({ ...table });
    setShowEditTableModal(true);
  };

  const saveTableEdit = () => {
    setTables(tables.map(t => t.id === tableToEdit.id ? tableToEdit : t));
    setShowEditTableModal(false);
  };

  const renderTables = () => (
    <div className="flex flex-col h-full bg-[#FAF9F6]">
      <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-100 overflow-x-auto scrollbar-hide">
        {areas.map(area => (
          <button
            key={area.id}
            onClick={() => setActiveArea(area.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeArea === area.id 
                ? 'bg-[#5D4037] text-white shadow-md shadow-[#5D4037]/20' 
                : 'bg-white border border-gray-200 text-[#5D4037] hover:bg-[#FAF9F6]'
            }`}
          >
            {area.name}
            <span className="ml-2 px-1.5 py-0.5 bg-black/10 rounded-md text-xs">
              {tables.filter(t => t.areaId === area.id).length}
            </span>
          </button>
        ))}
        <button className="p-2.5 border border-dashed border-gray-300 rounded-xl text-gray-400 hover:text-[#5D4037] hover:border-[#5D4037] transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {tables.filter(t => t.areaId === activeArea).map(table => {
            const isSelected = selectedTable === table.id;
            const isOccupied = table.status === 'occupied';
            const tableOrders = orders[table.id] || [];
            const itemsCount = tableOrders.reduce((acc, curr) => acc + curr.qty, 0);
            const totalAmount = tableOrders.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

            return (
              <div 
                key={table.id}
                onClick={() => setSelectedTable(table.id)}
                className={`relative bg-white rounded-2xl border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'border-[#5D4037] shadow-md' : 'border-transparent shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isOccupied ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-emerald-400'}`}></div>
                    <h4 className="font-bold text-gray-900 text-lg">{table.name}</h4>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); openEditTableModal(table); }}
                    className="p-1.5 text-gray-400 hover:text-[#5D4037] hover:bg-[#FAF9F6] rounded-lg transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>

                {isOccupied ? (
                  <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> TG ngồi:</span>
                      <span className="font-semibold text-gray-700">{table.seatedAt ? getElapsedMinutes(table.seatedAt) : 'Vừa xong'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5"><Coffee className="w-3.5 h-3.5"/> Số món:</span>
                      <span className="font-semibold text-gray-700">{itemsCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-1">
                      <span className="text-gray-500 flex items-center gap-1.5"><Banknote className="w-3.5 h-3.5"/> Tổng:</span>
                      <span className="font-bold text-[#5D4037]">{totalAmount.toLocaleString()}đ</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-[104px] mt-4 pt-4 border-t border-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">Bàn trống</span>
                  </div>
                )}
              </div>
            );
          })}
          <div className="bg-transparent border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:text-[#5D4037] hover:border-[#5D4037] transition-colors cursor-pointer min-h-[160px]">
            <Plus className="w-8 h-8 mb-2" />
            <span className="font-semibold">Thêm bàn</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => {
    const filteredItems = MENU_ITEMS.filter(item => {
      const matchesCategory = activeCategory === 'Tất cả' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return (
      <div className="flex flex-col h-full bg-[#FAF9F6]">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63]" />
            <input 
              type="text" 
              placeholder="Tìm món..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
            />
          </div>
          
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#5D4037] text-white shadow-sm' 
                    : 'bg-[#EFEBE9] text-[#5D4037] hover:bg-[#D7CCC8]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => addToCart(item)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition-all group active:scale-95"
              >
                <div className="aspect-square bg-gray-100 relative">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-[#5D4037]">
                    {item.category}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                  <p className="text-[#5D4037] font-bold mt-1">{item.price.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCart = () => {
    const cart = selectedTable ? (orders[selectedTable] || []) : [];
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const selectedTableObj = tables.find(t => t.id === selectedTable);

    return (
      <>
        <div className="p-4 border-b border-gray-200 bg-white flex flex-col gap-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5 text-[#5D4037]" />
              <span className="font-bold text-sm">NV: Nguyễn Văn An</span>
            </div>
            {selectedTable && selectedTableObj?.status === 'occupied' && (
              <button 
                onClick={() => setShowTransferModal(true)}
                className="px-3 py-1.5 bg-[#EFEBE9] hover:bg-[#D7CCC8] border border-transparent rounded-lg text-sm font-bold text-[#5D4037] flex items-center gap-1.5 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" /> Chuyển bàn
              </button>
            )}
          </div>
          
          {selectedTable ? (
            <div className="flex items-center justify-between bg-[#FAF9F6] p-3 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#5D4037] text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {selectedTableObj?.name.split(' ').pop() || 'T'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedTableObj?.name}</h3>
                  <p className="text-xs text-gray-500">{areas.find(a => a.id === selectedTableObj?.areaId)?.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                selectedTableObj?.status === 'occupied' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                {selectedTableObj?.status === 'occupied' ? 'Đang phục vụ' : 'Bàn trống'}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center bg-[#FAF9F6] p-4 rounded-xl border border-dashed border-gray-300">
              <p className="text-sm font-medium text-gray-500">Vui lòng chọn bàn để order</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F6]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-30" />
              <p className="font-medium text-sm">Chưa có món nào</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                  <p className="text-gray-500 text-xs mt-1">{item.price.toLocaleString()}đ</p>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-[#EFEBE9] text-[#5D4037] rounded-lg hover:bg-[#D7CCC8]">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="font-bold text-[#5D4037]">{(item.price * item.qty).toLocaleString()}đ</span>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-white space-y-4 z-10">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Tạm tính ({cart.reduce((a, b) => a + b.qty, 0)} món)</span>
            <span className="font-semibold">{total.toLocaleString()}đ</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Khuyến mãi</span>
            <span className="font-semibold">0đ</span>
          </div>
          <div className="flex items-center justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Tổng cộng</span>
            <span className="text-[#5D4037]">{total.toLocaleString()}đ</span>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={() => setShowPayment(true)}
            className="w-full py-3.5 bg-[#5D4037] text-white rounded-xl font-bold text-lg hover:bg-[#3E2723] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#5D4037]/20 flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            THANH TOÁN
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-112px)] -m-6 bg-[#FAF9F6] relative overflow-hidden">
      {/* Left/Middle Content */}
      <div className="flex-1 flex flex-col h-full bg-[#FAF9F6] border-r border-gray-200">
        {/* Top Navigation */}
        <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex bg-[#EFEBE9] p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('tables')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'tables' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-500 hover:text-[#5D4037]'}`}
            >
              <LayoutGrid className="w-4 h-4" />
              Phòng / Bàn
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'menu' ? 'bg-white text-[#5D4037] shadow-sm' : 'text-gray-500 hover:text-[#5D4037]'}`}
            >
              <Coffee className="w-4 h-4" />
              Thực đơn
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowChat(!showChat)}
              className="relative p-2 text-[#5D4037] bg-white border border-gray-200 rounded-xl hover:bg-[#FAF9F6] transition-colors shadow-sm"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
          </div>
        </div>

        {activeTab === 'tables' ? renderTables() : renderMenu()}
      </div>

      {/* Right: Cart */}
      <div className="w-[400px] flex flex-col bg-white h-full shrink-0 shadow-[-4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">
        {renderCart()}
      </div>

      {/* Chat Widget */}
      <div className={`absolute bottom-6 right-[420px] w-80 bg-white rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right z-50 flex flex-col border border-gray-200 overflow-hidden ${showChat ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="p-3 bg-[#5D4037] text-white flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <MessageSquare className="w-4 h-4" />
            Tin nhắn nội bộ
          </div>
          <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="h-80 p-4 bg-[#FAF9F6] overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, i) => {
            const isMe = msg.sender === 'Bạn';
            return (
              <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1`}>
                <span className="text-[10px] text-gray-500 font-medium px-1">{msg.sender} • {msg.time}</span>
                <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                  isMe ? 'bg-[#5D4037] text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Nhập tin nhắn..." 
            className="flex-1 px-3 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if(e.key === 'Enter' && newMessage.trim()) {
                setMessages([...messages, { sender: 'Bạn', text: newMessage, time: new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) }]);
                setNewMessage('');
              }
            }}
          />
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="font-bold text-lg text-gray-900">Chuyển bàn</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Chọn bàn muốn chuyển đến từ <strong>{tables.find(t=>t.id===selectedTable)?.name}</strong>:</p>
              
              <div className="max-h-60 overflow-y-auto space-y-2 mb-6 scrollbar-hide">
                {tables.filter(t => t.id !== selectedTable).map(t => (
                  <button 
                    key={t.id}
                    onClick={() => handleTransfer(t.id)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-[#5D4037] hover:bg-[#FAF9F6] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${t.status === 'occupied' ? 'bg-orange-500' : 'bg-emerald-400'}`}></div>
                      <span className="font-bold text-gray-900">{t.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {areas.find(a => a.id === t.areaId)?.name}
                    </span>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowTransferModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                HỦY BỎ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditTableModal && tableToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="font-bold text-lg text-gray-900">Chỉnh sửa thông tin bàn</h3>
              <button onClick={() => setShowEditTableModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tên bàn</label>
                <input 
                  type="text" 
                  value={tableToEdit.name}
                  onChange={e => setTableToEdit({...tableToEdit, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Khu vực</label>
                <div className="relative">
                  <select 
                    value={tableToEdit.areaId}
                    onChange={e => setTableToEdit({...tableToEdit, areaId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#5D4037]/20"
                  >
                    {areas.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowEditTableModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  HỦY
                </button>
                <button 
                  onClick={saveTableEdit}
                  className="flex-1 py-3 bg-[#5D4037] text-white rounded-xl font-bold hover:bg-[#4E342E] transition-colors shadow-md shadow-[#5D4037]/20"
                >
                  LƯU THAY ĐỔI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="font-bold text-lg text-gray-900">Thanh toán</h3>
              <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-8">
                <p className="text-gray-500 text-sm font-medium mb-2">Số tiền cần thanh toán</p>
                <p className="text-4xl font-bold text-[#5D4037]">{(selectedTable ? (orders[selectedTable] || []).reduce((sum, item) => sum + item.price * item.qty, 0) : 0).toLocaleString()}đ</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                <button className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-[#5D4037] bg-[#EFEBE9] rounded-xl text-[#5D4037]">
                  <Banknote className="w-6 h-6" />
                  <span className="font-bold text-sm">Tiền mặt</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                  <CreditCard className="w-6 h-6" />
                  <span className="font-bold text-sm">Thẻ</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 p-4 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                  <Smartphone className="w-6 h-6" />
                  <span className="font-bold text-sm">Ví / QR</span>
                </button>
              </div>

              <button 
                onClick={handlePayment}
                className="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
              >
                HOÀN TẤT (IN HÓA ĐƠN)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
