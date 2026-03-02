/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Briefcase, Utensils, GraduationCap, Trophy, ChevronLeft } from 'lucide-react';

// --- Types & Constants ---

type View = 'PASSWORD' | 'MAIN_MENU' | 'IMY_CHAT' | 'NAME_CHECK' | 'YY_ADOPT' | 'YY_PET' | 'YY_GOMOKU' | 'YY_SHOP' | 'YY_INVENTORY' | 'INFO' | 'GAME_OVER';

interface PetData {
  hunger: number;
  affection: number;
  money: number;
  inventory: string[];
}

const INITIAL_PET_DATA: PetData = {
  hunger: 50,
  affection: 0,
  money: 500,
  inventory: [],
};

const FOODS = [
  { id: 'hj-mian', name: '火鸡面', price: 100, hungerEffect: -20, affectionEffect: 30 },
  { id: 'ad-gai', name: 'AD钙', price: 60, hungerEffect: -10, affectionEffect: 20 },
  { id: 'cola', name: '可乐', price: 50, hungerEffect: -10, affectionEffect: 10 },
  { id: 'rat-poison', name: '老鼠药', price: 0, hungerEffect: 0, affectionEffect: -99, special: '你是傻逼吧！' },
];

const NAME_RESPONSES: Record<string, string> = {
  '刘佳怡': '额臭人机，好感6+1=7，等你下课一起走好吗',
  '尹梦诗': '不许玩人生模拟器了，好感9127，跪下',
  '张熳': '我去了呀你的车技特别牛逼呀，雨中骑车也是特别忧郁好的吧，让我成为你的一把伞',
  '李霏': '你也是直接给我坐下吧小飞飞😏',
  '张艺楷': '你叫这名吗你就写？这是神的名字',
  '康祎': '额你的祎真难找，不要再刷低脂小视频了🥵🥵🥵',
  '边心语': '你的狗要认我当主人了😏',
  '苗玉寒': '我去你的颜值也是无敌雷霆美啊',
  '李雨嘉': '超级无敌好同桌',
  '吴欣怡': '我去媳妇，给你买了个平板壳在网上没付钱呢',
};

// --- Components ---

export default function App() {
  const [view, setView] = useState<View>('PASSWORD');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [petModal, setPetModal] = useState<string | null>(null);
  
  // Pet State
  const [petData, setPetData] = useState<PetData>(() => {
    const saved = localStorage.getItem('yy_pet_data');
    return saved ? JSON.parse(saved) : INITIAL_PET_DATA;
  });

  useEffect(() => {
    localStorage.setItem('yy_pet_data', JSON.stringify(petData));
  }, [petData]);

  const updatePet = (updates: Partial<PetData>) => {
    setPetData(prev => {
      const newData = { ...prev, ...updates };
      // Clamp values
      newData.hunger = Math.max(0, Math.min(100, newData.hunger));
      newData.affection = Math.max(-9999, Math.min(9999, newData.affection));
      return newData;
    });
  };

  // --- Views ---

  const renderPasswordPage = () => (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold text-gray-200 mb-12 tracking-widest">我的微信名</h1>
      <div className="w-full max-w-xs space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (password.toUpperCase() === 'IMY') {
                setView('MAIN_MENU');
              } else {
                setPasswordError(true);
              }
            }
          }}
          className="w-full px-4 py-3 border-b-2 border-gray-200 focus:border-gray-400 outline-none text-center text-xl tracking-widest transition-colors"
          placeholder="请输入密码"
        />
        {passwordError && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 text-lg"
          >
            呃……
          </motion.p>
        )}
      </div>
    </div>
  );

  const renderMainMenu = () => (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-6 space-y-8">
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <MenuButton 
          label="IMY" 
          color="bg-[#e2e8f0]" 
          onClick={() => setView('IMY_CHAT')} 
        />
        <MenuButton 
          label="˶˃ ᵕ ˂˶" 
          color="bg-[#f1f5f9]" 
          onClick={() => setView('NAME_CHECK')} 
        />
        <MenuButton 
          label="YY" 
          color="bg-[#f8fafc]" 
          onClick={() => setView('YY_ADOPT')} 
        />
        <MenuButton 
          label="劲爆‼️" 
          color="bg-[#cbd5e1]" 
          onClick={() => setView('INFO')} 
        />
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-800">
      <AnimatePresence mode="wait">
        {view === 'PASSWORD' && renderPasswordPage()}
        {view === 'MAIN_MENU' && renderMainMenu()}
        {view === 'IMY_CHAT' && <IMYChatView onBack={() => setView('MAIN_MENU')} />}
        {view === 'NAME_CHECK' && <NameCheckView onBack={() => setView('MAIN_MENU')} />}
        {view === 'YY_ADOPT' && <YYAdoptView onBack={() => setView('MAIN_MENU')} onAdopt={() => setView('YY_PET')} />}
        {view === 'YY_PET' && (
          <YYPetView 
            data={petData} 
            update={updatePet} 
            onBack={() => setView('MAIN_MENU')} 
            onGomoku={() => setView('YY_GOMOKU')}
            onShop={() => setView('YY_SHOP')}
            onInventory={() => setView('YY_INVENTORY')}
            onGameOver={() => setView('GAME_OVER')}
            onShowModal={(msg: string) => setPetModal(msg)}
          />
        )}
        {view === 'YY_GOMOKU' && (
          <GomokuView 
            onBack={() => setView('YY_PET')} 
            onResult={(win) => {
              updatePet({ affection: petData.affection + (win ? -1 : 10) });
            }}
          />
        )}
        {view === 'YY_SHOP' && (
          <ShopView 
            money={petData.money} 
            onBack={() => setView('YY_PET')} 
            onBuy={(food) => {
              updatePet({ 
                money: petData.money - food.price,
                inventory: [...petData.inventory, food.id]
              });
            }}
          />
        )}
        {view === 'YY_INVENTORY' && (
          <InventoryView 
            inventory={petData.inventory} 
            onBack={() => setView('YY_PET')} 
            onFeed={(foodId) => {
              const food = FOODS.find(f => f.id === foodId);
              if (!food) return;
              
              // If hunger is too low (meaning full), YY is stuffed
              if (petData.hunger <= 10 && food.hungerEffect < 0) {
                setPetModal('YY太撑了，拒绝进食！');
                return;
              }

              if (food.special === '你是傻逼吧！') {
                setPetModal('你是傻逼吧！');
              }

              const newInventory = [...petData.inventory];
              const index = newInventory.indexOf(foodId);
              newInventory.splice(index, 1);

              updatePet({
                hunger: petData.hunger + food.hungerEffect,
                affection: petData.affection + food.affectionEffect,
                inventory: newInventory
              });
            }}
          />
        )}
        {view === 'INFO' && <InfoView onBack={() => setView('MAIN_MENU')} />}
        {view === 'GAME_OVER' && (
          <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">GAME OVER</h1>
            <p className="text-xl mb-8">你的YY离家出走了！</p>
            <button 
              onClick={() => {
                setPetData(INITIAL_PET_DATA);
                setView('MAIN_MENU');
              }}
              className="px-6 py-2 bg-white text-black rounded-full font-bold"
            >
              重新开始
            </button>
          </div>
        )}
      </AnimatePresence>

      {/* Pet System Modal */}
      <AnimatePresence>
        {petModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-[100]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-xs w-full text-center relative shadow-2xl"
            >
              <button 
                onClick={() => setPetModal(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <div className="text-5xl mb-6">
                {petModal === '你是傻逼吧！' ? '💢' : '🥣'}
              </div>
              <p className="text-xl font-bold text-gray-800 leading-relaxed">
                {petModal}
              </p>
              <button 
                onClick={() => setPetModal(null)}
                className="mt-8 w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg"
              >
                知道了
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Views ---

function MenuButton({ label, color, onClick }: { label: string, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${color} aspect-square rounded-2xl shadow-lg flex items-center justify-center text-2xl font-medium text-gray-600 border border-white/20`}
    >
      {label}
    </motion.button>
  );
}

function IMYChatView({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [iqButtonText, setIqButtonText] = useState('-10000分');
  const [finalModal, setFinalModal] = useState<string | null>(null);

  const messages = [
    {
      q: '给我的善良打分，你打几分？',
      options: [
        { label: '100分', next: 1 },
        { label: '100000分', next: 1 }
      ]
    },
    {
      q: '给我的智商打分你打多少分？',
      options: [
        { label: '-10000分', action: () => setIqButtonText('您的智商太高已经不能用数字衡量！'), delayNext: true },
        { label: '99999999分', next: 2 }
      ]
    },
    {
      q: '想不想开学？',
      options: [
        { label: '想', action: () => setFinalModal('私信找我领作业') },
        { label: '不想', action: () => setFinalModal('惩罚你私信找我领作业！') }
      ]
    }
  ];

  const current = messages[step];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-[#f0f2f5] flex flex-col relative"
    >
      <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-500">IMY 聊天</h2>
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><X size={20} /></button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-64">
        {messages.slice(0, step + 1).map((m, i) => (
          <div key={i} className="flex flex-col space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] self-start"
            >
              {m.q}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Options at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f0f2f5] via-[#f0f2f5] to-transparent pt-12 flex flex-col gap-3">
        {current.options.map((opt, j) => (
          <motion.button
            key={j}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (opt.action) opt.action();
              if (opt.next !== undefined) {
                setStep(opt.next);
              } else if (opt.delayNext) {
                setTimeout(() => setStep(step + 1), 1500);
              }
            }}
            className="w-full py-5 bg-blue-500 text-white rounded-2xl font-bold shadow-xl text-xl transition-all active:bg-blue-600"
          >
            {step === 1 && j === 0 ? iqButtonText : opt.label}
          </motion.button>
        ))}
      </div>

      {/* Final Modal */}
      <AnimatePresence>
        {finalModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-xs w-full text-center relative shadow-2xl"
            >
              <button 
                onClick={onBack}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <div className="text-5xl mb-6">📚</div>
              <p className="text-xl font-bold text-gray-800 leading-relaxed">
                {finalModal}
              </p>
              <button 
                onClick={onBack}
                className="mt-8 w-full py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg"
              >
                返回主界面
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NameCheckView({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [result, setResult] = useState('');

  const handleCheck = () => {
    const res = NAME_RESPONSES[name] || '喵喵喵OvO';
    setResult(res);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white p-8 flex flex-col items-center justify-center text-center"
    >
      <button onClick={onBack} className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full"><X size={24} /></button>
      
      <h2 className="text-4xl font-bold mb-2">你的名字</h2>
      <p className="text-gray-400 text-sm mb-8">技术有限，只有部分名字❤️</p>
      
      <div className="w-full max-w-xs space-y-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border-b-2 border-gray-100 focus:border-blue-200 outline-none text-center text-xl"
          placeholder="输入名字"
        />
        <button 
          onClick={handleCheck}
          className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg"
        >
          查询
        </button>
        
        {result && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 p-6 bg-gray-50 rounded-2xl text-lg text-gray-700 leading-relaxed"
          >
            {result}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function YYAdoptView({ onBack, onAdopt }: { onBack: () => void, onAdopt: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl"
      >
        <h3 className="text-xl font-bold mb-6">是否要领养一个YY</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => { alert('哦'); onBack(); }}
            className="flex-1 py-3 bg-gray-100 rounded-xl font-bold"
          >
            不要
          </button>
          <button 
            onClick={onAdopt}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200"
          >
            要
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function YYPetView({ data, update, onBack, onGomoku, onShop, onInventory, onGameOver }: any) {
  const [showSchoolPopup, setShowSchoolPopup] = useState(false);

  useEffect(() => {
    if (data.affection >= 520) {
      alert('凭此截图找我领神秘惊喜❤️');
    }
  }, [data.affection]);

  const handleSchool = async () => {
    setShowSchoolPopup(false);
    const steps = ['第一天……', '第二天……', '第三天……', '第四天……', '第五天……', '第六天……'];
    for (const s of steps) {
      alert(s);
    }
    onGameOver();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f8fafc] p-6 flex flex-col"
    >
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm"><ChevronLeft size={24} /></button>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400">💰</span>
            <span className="font-mono font-bold">{data.money}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl"
          >
            {data.hunger < 30 ? '😋' : data.hunger > 80 ? '😫' : '😊'}
          </motion.div>
          <div className="absolute -top-4 -right-4 bg-white px-2 py-1 rounded-lg shadow-sm text-[10px] font-bold text-blue-500">
            YY
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <StatBar label="饥饿度" value={data.hunger} color="bg-orange-400" />
          <StatBar label="好感度" value={data.affection} color="bg-pink-400" min={-9999} max={9999} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-8">
        <ActionButton icon={<Briefcase size={20} />} label="打工" onClick={() => update({ money: data.money + 1000 })} />
        <ActionButton icon={<Utensils size={20} />} label="喂养" onClick={onInventory} />
        <ActionButton icon={<Trophy size={20} />} label="五子棋" onClick={onGomoku} />
        <ActionButton 
          icon={<GraduationCap size={20} />} 
          label="学校" 
          color="bg-red-800 text-white" 
          onClick={() => setShowSchoolPopup(true)} 
        />
      </div>

      <button 
        onClick={onShop}
        className="fixed bottom-24 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-500 border border-blue-50"
      >
        <ShoppingCart size={24} />
      </button>

      {showSchoolPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-xs w-full text-center">
            <h3 className="text-xl font-bold mb-6">我不要上学！</h3>
            <div className="flex flex-col gap-3">
              <button onClick={handleSchool} className="py-3 bg-red-50 text-red-600 rounded-xl font-bold">坚持送去学校</button>
              <button 
                onClick={() => { update({ affection: data.affection + 50 }); setShowSchoolPopup(false); }}
                className="py-3 bg-gray-100 rounded-xl font-bold"
              >
                接回家
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function StatBar({ label, value, color, min = 0, max = 100 }: any) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick, color = "bg-white text-gray-600" }: any) {
  return (
    <button 
      onClick={onClick}
      className={`${color} aspect-square rounded-2xl shadow-sm flex flex-col items-center justify-center gap-1 border border-black/5`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function ShopView({ money, onBack, onBuy }: any) {
  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">商城</h2>
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><X size={24} /></button>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto">
        {FOODS.map(food => (
          <div key={food.id} className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center text-center space-y-3">
            <div className="text-4xl">
              {food.id === 'hj-mian' ? '🍜' : food.id === 'ad-gai' ? '🥛' : food.id === 'cola' ? '🥤' : '☠️'}
            </div>
            <div className="font-bold">{food.name}</div>
            <div className="text-xs text-gray-400">
              {food.hungerEffect !== 0 && `饥饿度 ${food.hungerEffect} `}
              {`好感 +${food.affectionEffect}`}
            </div>
            <button 
              disabled={money < food.price}
              onClick={() => onBuy(food)}
              className={`w-full py-2 rounded-xl font-bold text-sm ${money >= food.price ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              {food.price}元
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function InventoryView({ inventory, onBack, onFeed }: any) {
  const items = inventory.map((id: string) => FOODS.find(f => f.id === id)).filter(Boolean);

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">背包</h2>
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><X size={24} /></button>
      </div>
      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
          <div className="text-6xl mb-4">🎒</div>
          <p>背包空空如也</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {items.map((item: any, i: number) => (
            <button 
              key={i}
              onClick={() => onFeed(item.id)}
              className="bg-gray-50 p-4 rounded-3xl flex flex-col items-center gap-2"
            >
              <div className="text-4xl">
                {item.id === 'hj-mian' ? '🍜' : item.id === 'ad-gai' ? '🥛' : item.id === 'cola' ? '🥤' : '☠️'}
              </div>
              <div className="font-bold">{item.name}</div>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function GomokuView({ onBack, onResult }: any) {
  const SIZE = 10;
  const [board, setBoard] = useState<(number | null)[]>(Array(SIZE * SIZE).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(false); // YY (Black) starts first
  const [winner, setWinner] = useState<number | null>(null);

  // YY's turn (Black = 1)
  useEffect(() => {
    if (!isUserTurn && !winner) {
      const timer = setTimeout(() => {
        makeYYMove();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn, winner]);

  const checkWin = (currentBoard: (number | null)[], index: number) => {
    const player = currentBoard[index];
    if (player === null) return false;

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];

    for (const [dr, dc] of directions) {
      let count = 1;
      // Check forward
      for (let i = 1; i < 5; i++) {
        const nr = row + dr * i;
        const nc = col + dc * i;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && currentBoard[nr * SIZE + nc] === player) {
          count++;
        } else break;
      }
      // Check backward
      for (let i = 1; i < 5; i++) {
        const nr = row - dr * i;
        const nc = col - dc * i;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && currentBoard[nr * SIZE + nc] === player) {
          count++;
        } else break;
      }
      if (count >= 5) return true;
    }
    return false;
  };

  const makeYYMove = () => {
    const emptyIndices = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (emptyIndices.length === 0) return;

    // Simple AI: Random move
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const nextBoard = [...board];
    nextBoard[randomIndex] = 1; // YY is Black
    setBoard(nextBoard);
    
    if (checkWin(nextBoard, randomIndex)) {
      setWinner(1);
      onResult(false);
      alert('YY: 坐下！');
    } else {
      setIsUserTurn(true);
    }
  };

  const handleUserMove = (index: number) => {
    if (!isUserTurn || board[index] !== null || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = 2; // User is White
    setBoard(nextBoard);

    if (checkWin(nextBoard, index)) {
      setWinner(2);
      onResult(true);
      alert('YY: 让你一把');
    } else {
      setIsUserTurn(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">五子棋 (YY先手)</h2>
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-10 gap-0 border-2 border-gray-800 bg-[#dcb35c] shadow-2xl">
        {board.map((cell, i) => (
          <div 
            key={i} 
            onClick={() => handleUserMove(i)}
            className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-800/20 flex items-center justify-center cursor-pointer relative"
          >
            {/* Grid lines */}
            <div className="absolute w-full h-[1px] bg-gray-800/30 top-1/2 left-0 -translate-y-1/2" />
            <div className="absolute h-full w-[1px] bg-gray-800/30 left-1/2 top-0 -translate-x-1/2" />
            
            {cell === 1 && <div className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full shadow-md z-10" />}
            {cell === 2 && <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full shadow-md z-10" />}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center space-y-2">
        <p className="font-bold text-gray-400">
          {winner ? (winner === 1 ? 'YY 获胜' : '你 获胜') : (isUserTurn ? '你的回合 (白棋)' : 'YY的回合 (黑棋)')}
        </p>
        {winner && (
          <button 
            onClick={() => {
              setBoard(Array(SIZE * SIZE).fill(null));
              setWinner(null);
              setIsUserTurn(false);
            }}
            className="px-6 py-2 bg-gray-900 text-white rounded-full font-bold"
          >
            再来一局
          </button>
        )}
      </div>
    </motion.div>
  );
}

function InfoView({ onBack }: { onBack: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f1f5f9] p-8 flex flex-col items-center justify-center">
      <button onClick={onBack} className="absolute top-6 right-6 p-2 bg-white rounded-full shadow-sm"><X size={24} /></button>
      <div className="w-full max-w-xs space-y-4">
        <InfoButton label="我的抖音:同微信号" />
        <InfoButton label="我的qq:192952534" />
        <InfoButton label="我的身份:？？？" />
      </div>
    </motion.div>
  );
}

function InfoButton({ label }: { label: string }) {
  return (
    <button className="w-full py-4 bg-white rounded-2xl shadow-sm font-bold text-gray-600 border border-white">
      {label}
    </button>
  );
}
