import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, ChevronLeft, ChevronRight, MapPin, Phone } from "lucide-react";
import { menuItems } from "@/lib/menuData";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { ShareButtons } from "@/components/ShareButtons";
import { Language, TranslationKey } from "@/lib/translations";

interface CartItem {
  id: string;
  quantity: number;
}
export default function App() {
  const { language, changeLanguage, t } = useLanguage();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedDish, setSelectedDish] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "delivery" | "address" | "channel" | "confirm" | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup" | null>(null);
  const [address, setAddress] = useState({ street: "", number: "", floor: "", apartment: "" });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const addToCart = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    const existing = cart.find(item => item.id === id);
    if (existing) {
      setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { id, quantity }]);
    }
    const dish = menuItems.find(d => d.id === id);
    toast.success(`${dish ? t(dish.nameKey as any) : ''} ${t('addedToCart')}`);
    setSelectedDish(null);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      const dish = menuItems.find(d => d.id === item.id);
      return total + (dish?.price || 0) * item.quantity;
    }, 0);
  };

  const getDeliveryFee = () => {
    return deliveryMethod === "delivery" ? 10 : 0;
  };

  const getTotalPrice = () => {
    return getSubtotal() + getDeliveryFee();
  };

  const startCheckout = () => {
    if (cart.length === 0) {
      toast.error(t('addDishesToCart'));
      return;
    }
    setCheckoutStep("delivery");
  };

  const handleDeliveryChoice = (method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    setCheckoutStep("address");
  };

  const handleAddressSubmit = () => {
    if (deliveryMethod === "delivery") {
      if (!address.street || !address.number || !address.floor || !address.apartment) {
        toast.error(t('fillAllAddressFields'));
        return;
      }
    }
    if (!deliveryDate) {
      toast.error(t('selectDate'));
      return;
    }
    if (!deliveryTime) {
      toast.error(t('selectTime'));
      return;
    }
    setCheckoutStep("channel");
  };

  const formatOrderMessage = (channel: "whatsapp" | "telegram") => {
    const items = cart.map(item => {
      const dish = menuItems.find(d => d.id === item.id);
      return `${dish ? t(dish.nameKey as any) : ''} x${item.quantity}`;
    }).join("\n");

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotalPrice();

    const deliveryInfo = deliveryMethod === "pickup"
      ? `${t('pickup')}\n${t('dateLabel')} ${deliveryDate}\n${t('timeLabel')} ${deliveryTime}`
      : `${t('deliveryAddress')}: ${address.street} ${address.number}, ${t('floor')} ${address.floor}, ${language === 'ru' ? 'Кв.' : 'Apt.'} ${address.apartment}\n${t('dateLabel')} ${deliveryDate}\n${t('timeLabel')} ${deliveryTime}`;

    const feeText = deliveryFee > 0 ? `\n${t('deliveryFee')}: €${deliveryFee}` : "";
    return `${t('orderItems')}:\n\n${items}\n\n${t('amount')} €${subtotal.toFixed(2)}${feeText}\n${t('orderTotal')}: €${total.toFixed(2)}\n\n${deliveryInfo}`;
  };

  const handleSendOrder = (channel: "whatsapp" | "telegram") => {
    const message = encodeURIComponent(formatOrderMessage(channel));
    if (channel === "whatsapp") {
      window.open(`https://wa.me/34602478357?text=${message}`, "_blank");
    } else {
      window.open(`https://t.me/salievr?start=${message}`, "_blank");
    }
    setCart([]);
    setCheckoutStep(null);
    setDeliveryMethod(null);
    setAddress({ street: "", number: "", floor: "", apartment: "" });
    setDeliveryDate("");
    setDeliveryTime("");
    toast.success(t('orderSent'));
  };

  // make sure to consider if you need authentication for certain routes
  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          14% { transform: scale(1.25); }
          28% { transform: scale(1); }
          42% { transform: scale(1.25); }
          70% { transform: scale(1); }
        }
        .animate-heartbeat {
          animation: heartbeat 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-yellow-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
          {/* Logo - Compact */}
          <button
            onClick={() => setCheckoutStep(null)}
            className="flex items-center gap-2 min-w-0 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
            title="Return to menu"
          >
            <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663374134073/WqXVOUFrIzGSwPIk.webp" alt="PlovSpain" className="h-10 md:h-14 w-10 md:w-14 rounded-full shadow-md flex-shrink-0" />
            <div className="text-lg md:text-2xl font-poppins font-black tracking-tight whitespace-nowrap flex items-center">
              <span className="flex items-center gap-0">
                <span className="text-yellow-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>PL</span>
                <span className="text-red-500 animate-heartbeat inline-block" style={{ textShadow: '0 0 8px rgba(255,0,0,0.6), 0 0 12px rgba(255,255,0,0.4)', margin: '0', fontSize: '1.2em' }}>❤️</span>
                <span className="text-yellow-300" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>V</span>
              </span>
              <span className="text-white font-black ml-1" style={{
                textShadow: '2px 2px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000, 0px 2px 0px #000, 0px -2px 0px #000, 2px 0px 0px #000, -2px 0px 0px #000',
                WebkitTextStroke: '1px #000'
              }}>Spain</span>
            </div>
          </button>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* Language Buttons - Improved */}
            <div className="flex gap-1 bg-gray-700 rounded-lg p-1 border-2 border-gray-600 hover:border-yellow-400 transition">
              <button onClick={() => changeLanguage('ru')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded font-bold text-xs md:text-sm transition ${language === 'ru' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>РУ</button>
              <button onClick={() => changeLanguage('es')} className={`px-3 md:px-4 py-1.5 md:py-2 rounded font-bold text-xs md:text-sm transition ${language === 'es' ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>ES</button>
            </div>
            {/* Share Buttons - Hidden on very small screens */}
            <div className="hidden sm:flex">
              <ShareButtons title="PlovSpain" text={language === 'ru' ? 'Закажи узбекскую кухню в Барселоне!' : '¡Pide comida uzbeka en Barcelona!'} size="sm" />
            </div>
            {/* Cart Button */}
            <button onClick={() => setCheckoutStep("cart")} className="relative p-2 md:p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg flex-shrink-0">
              <ShoppingCart size={20} className="md:w-6 md:h-6" />
              {cart.length > 0 && (<span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-white text-red-600 text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">{cart.length}</span>)}
            </button>
          </div>
        </div>
      </header >

      {/* Main Content */}
      < main className="max-w-7xl mx-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }
      }>
        {!checkoutStep ? (
          <>
            {/* Hero Section */}
            <div className="px-4 py-8 bg-gradient-to-b from-red-50 to-white">
              <h1 className="text-4xl font-poppins font-black text-gray-900 mb-2">
                {t('formYourOrder')}
              </h1>
              <p className="text-lg text-gray-600 font-poppins">
                {t('uzbekKitchen')}
              </p>
            </div>

            {/* Menu Grid - Vertical Scroll */}
            <div className="px-4 pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map(dish => (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    onSelect={() => setSelectedDish(dish.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </>
        ) : checkoutStep === "cart" ? (
          <CartView cart={cart} menuItems={menuItems} onClose={() => setCheckoutStep(null)} onCheckout={startCheckout} onRemove={removeFromCart} t={t} />
        ) : checkoutStep === "delivery" ? (
          <DeliveryStep onSelect={handleDeliveryChoice} t={t} />
        ) : checkoutStep === "address" ? (
          <AddressStep address={address} setAddress={setAddress} deliveryDate={deliveryDate} setDeliveryDate={setDeliveryDate} deliveryTime={deliveryTime} setDeliveryTime={setDeliveryTime} deliveryMethod={deliveryMethod} onSubmit={handleAddressSubmit} onBack={() => { setCheckoutStep("delivery"); setDeliveryMethod(null); }} t={t} language={language} />
        ) : checkoutStep === "channel" ? (
          <ChannelStep deliveryMethod={deliveryMethod} address={address} deliveryDate={deliveryDate} deliveryTime={deliveryTime} cart={cart} menuItems={menuItems} totalPrice={getTotalPrice()} onSend={handleSendOrder} onBack={() => setCheckoutStep(deliveryMethod === "pickup" ? "delivery" : "address")} t={t} language={language} />
        ) : null}
      </main >

      {/* Product Modal */}
      {
        selectedDish && (
          <ProductModal
            dish={menuItems.find(d => d.id === selectedDish)!}
            onClose={() => setSelectedDish(null)}
            onAddToCart={addToCart}
            t={t}
          />
        )
      }
    </div >
  );
}

function DishCard({ dish, onSelect, t }: any) {
  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100 group"
    >
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={dish.images[0]}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold font-poppins shadow-md">
          {t('from')} €{dish.price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 font-poppins">{t(dish.nameKey as any)}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 font-poppins">{t(dish.descKey as any)}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-poppins font-semibold">
            {dish.minQuantity}-{dish.maxQuantity} {t('portions')}
          </span>
          <span className="text-red-600 font-bold text-sm">{t('click')}</span>
        </div>
        <div className="mt-3 flex justify-center" onClick={(e) => e.stopPropagation()}>
          <ShareButtons title={t(dish.nameKey as any)} text={t(dish.descKey as any)} dishName={t(dish.nameKey as any)} size="sm" />
        </div>
      </div>
    </div>
  );
}

function ProductModal({ dish, onClose, onAddToCart, t }: any) {
  const [quantity, setQuantity] = useState(dish.minQuantity);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dish.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + dish.images.length) % dish.images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom">
        {/* Image Carousel */}
        <div className="relative h-72 overflow-hidden bg-gray-100">
          <img src={dish.images[currentImageIndex]} alt={t(dish.nameKey)} className="w-full h-full object-cover" />

          {/* Navigation Arrows */}
          {dish.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-md"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full transition shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          {dish.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-poppins">
              {currentImageIndex + 1} / {dish.images.length}
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 shadow-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-poppins">{t(dish.nameKey)}</h2>
            <p className="text-gray-600 mt-2 font-poppins text-sm">{t(dish.descKey)}</p>
          </div>

          <div className="flex justify-between items-center py-3 border-t border-b border-gray-100">
            <span className="text-3xl font-bold text-red-600 font-poppins">€{dish.price}</span>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded font-poppins font-semibold">
              {dish.minQuantity}-{dish.maxQuantity} {t('portions')}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
            <button
              onClick={() => setQuantity(Math.max(dish.minQuantity, quantity - 1))}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              <Minus size={20} className="text-gray-700" />
            </button>
            <span className="text-xl font-bold text-gray-900 font-poppins">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(dish.maxQuantity, quantity + 1))}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              <Plus size={20} className="text-gray-700" />
            </button>
          </div>

          <button
            onClick={() => onAddToCart(dish.id, quantity)}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 transition font-poppins text-lg shadow-md"
          >
            {t('addToCartHover')} • €{(dish.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartView({ cart, menuItems, onClose, onCheckout, onRemove, t }: any) {
  const subtotal = cart.reduce((sum: number, item: any) => {
    const dish = menuItems.find((d: any) => d.id === item.id);
    return sum + (dish?.price || 0) * item.quantity;
  }, 0);

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">{t('yourCart')}</h2>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center py-8 font-poppins">{t('emptyCart')}</p>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map((item: any) => {
                const dish = menuItems.find((d: any) => d.id === item.id);
                return (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-semibold text-gray-900 font-poppins">{dish ? t(dish.nameKey) : ''}</p>
                      <p className="text-sm text-gray-600 font-poppins">×{item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 font-poppins">€{(dish?.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => onRemove(item.id)} className="text-red-600 hover:text-red-700">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t-2 border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-semibold text-gray-700 font-poppins mb-2">
                <span>{t('amount')}</span>
                <span className="text-gray-900">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 font-poppins">
                <span>{t('total')}</span>
                <span className="text-red-600">€{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition font-poppins"
              >
                {t('back')}
              </button>
              <button
                onClick={onCheckout}
                className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition font-poppins"
              >
                {t('selectDeliveryConditions')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DeliveryStep({ onSelect, t }: any) {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">{t('deliveryTitle')}</h2>
      <div className="space-y-4">
        <button
          onClick={() => onSelect("delivery")}
          className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 text-left border-2 border-gray-100 hover:border-red-600"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🚗</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-poppins">{t('delivery')}</h3>
                <p className="text-gray-600 font-poppins text-sm">{t('deliveryDesc')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-red-600 font-poppins">€10</p>
              <p className="text-xs text-gray-500 font-poppins">{t('commission')}</p>
            </div>
          </div>
        </button>
        <button
          onClick={() => onSelect("pickup")}
          className="w-full bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 text-left border-2 border-gray-100 hover:border-red-600"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏪</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 font-poppins">{t('pickup')}</h3>
                <p className="text-gray-600 font-poppins text-sm">{t('pickupDesc')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600 font-poppins">{t('free')}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function AddressStep({ address, setAddress, deliveryDate, setDeliveryDate, deliveryTime, setDeliveryTime, deliveryMethod, onSubmit, onBack, t, language }: any) {
  const [errors, setErrors] = useState<{ street?: string, number?: string, floor?: string, apartment?: string, date?: string, time?: string }>({});

  const validateAndSubmit = () => {
    const newErrors: typeof errors = {};

    if (deliveryMethod === "delivery") {
      if (!address.street) newErrors.street = t('streetRequired');
      if (!address.number) newErrors.number = t('numberRequired');
      if (!address.floor) newErrors.floor = t('floorRequired');
      if (!address.apartment) newErrors.apartment = t('apartmentRequired');
    }
    if (!deliveryDate) newErrors.date = t('dateRequired');
    if (!deliveryTime) newErrors.time = t('timeRequired');

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins flex items-center gap-2">
          <MapPin size={24} className="text-red-600" />
          {deliveryMethod === "pickup" ? t('timeAndDate') : t('deliveryAddress')}
        </h2>
        <div className="space-y-4 mb-6">
          {deliveryMethod === "delivery" && (
            <>
              <div>
                <input
                  type="text"
                  placeholder={t('street')}
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.street ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
                />
                {errors.street && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.street}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t('houseNumber')}
                  value={address.number}
                  onChange={(e) => setAddress({ ...address, number: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.number ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
                />
                {errors.number && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.number}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t('floor')}
                  value={address.floor}
                  onChange={(e) => setAddress({ ...address, floor: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.floor ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
                />
                {errors.floor && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.floor}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t('apartment')}
                  value={address.apartment}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.apartment ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
                />
                {errors.apartment && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.apartment}</p>}
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">{t('selectDeliveryDate')}</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.date ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
            />
            {errors.date && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 font-poppins mb-2">{t('selectDeliveryTime')}</label>
            <input
              type="time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-poppins ${errors.time ? 'border-red-500 focus:ring-red-600' : 'border-gray-200 focus:ring-red-600'}`}
            />
            {errors.time && <p className="text-red-600 text-sm mt-1 font-poppins">{errors.time}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition font-poppins"
          >
            {t('back')}
          </button>
          <button
            onClick={validateAndSubmit}
            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition font-poppins"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChannelStep({ deliveryMethod, address, deliveryDate, deliveryTime, cart, menuItems, totalPrice, onSend, onBack, t, language }: any) {
  return (
    <div className="px-4 py-8 max-w-lg mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">{t('confirmation')}</h2>
        <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
          {cart.map((item: any) => {
            const dish = menuItems.find((d: any) => d.id === item.id);
            return (
              <div key={item.id} className="flex justify-between font-poppins">
                <span className="text-gray-700">{dish ? t(dish.nameKey) : ''} ×{item.quantity}</span>
                <span className="font-semibold text-gray-900">€{(dish?.price * item.quantity).toFixed(2)}</span>
              </div>
            );
          })}
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-bold text-gray-900">{t('total')}</span>
            <span className="font-bold text-red-600 text-lg">€{totalPrice.toFixed(2)}</span>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm font-poppins text-gray-700 space-y-2">
          <p>
            <strong>{t('deliveryFee')}:</strong> {deliveryMethod === "pickup" ? t('pickup') : t('delivery')}
          </p>
          {deliveryMethod === "delivery" && (
            <p>
              <strong>{t('addressLabel')}</strong> {address.street} {address.number}, {t('floor')} {address.floor}, {language === 'ru' ? 'Кв.' : 'Apt.'} {address.apartment}
            </p>
          )}
          <p>
            <strong>{t('dateLabel')}</strong> {deliveryDate}
          </p>
          <p>
            <strong>{t('timeLabel')}</strong> {deliveryTime}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">{t('placeOrder')}</h3>
      <div className="space-y-3">
        <button
          onClick={() => onSend("whatsapp")}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition font-poppins shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.325 0-2.651-.402-3.776-1.159L2.67 3.507l1.267 3.218c-.779 1.186-1.19 2.555-1.19 3.972 0 3.355 2.736 6.08 6.104 6.08 1.626 0 3.157-.627 4.306-1.764 1.148-1.136 1.781-2.665 1.781-4.315 0-3.368-2.736-6.102-6.104-6.102M19.52 3.641C17.677 1.797 15.229.75 12.514.75 5.923.75.5 6.175.5 12.766c0 2.25.588 4.458 1.706 6.413L.5 23.25l6.717-2.323c1.926 1.052 4.096 1.606 6.297 1.606 6.591 0 11.996-5.425 11.996-12.016 0-3.21-1.285-6.232-3.491-8.482" />
          </svg>
          {t('whatsapp')}
        </button>
        <button
          onClick={() => onSend("telegram")}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition font-poppins shadow-md flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.332-2.97-.924c-.644-.213-.658-.644.135-.954l11.593-4.461c.538-.196 1.006.128.832.941z" />
          </svg>
          {t('telegram')}
        </button>
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600 font-poppins mb-3 text-center">{t('shareWithFriends')}</p>
        <div className="flex justify-center mb-4" onClick={(e) => e.stopPropagation()}>
          <ShareButtons title="PlovSpain" text={language === 'ru' ? "Отличные узбекские блюда!" : "¡Excelentes platos uzbekos!"} size="md" />
        </div>
      </div>
      <button
        onClick={onBack}
        className="w-full mt-4 bg-gray-100 text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-200 transition font-poppins"
      >
        {t('back')}
      </button>
    </div>
  );
}
