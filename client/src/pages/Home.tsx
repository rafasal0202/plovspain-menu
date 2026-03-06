import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, ChevronRight, Plus, Minus, ShoppingCart, Check, Info, Globe } from "lucide-react";
import { menuItems } from "@/lib/menuData";
import { toast } from "sonner";
import useEmblaCarousel from "embla-carousel-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Language, TranslationKey } from "@/lib/translations";

interface CartItem {
  id: string;
  quantity: number;
}

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const { language, changeLanguage, t } = useLanguage();

  const [showSplash, setShowSplash] = useState(true);
  const [variant, setVariant] = useState<"1" | "2" | "3" | null>("3");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: string]: number }>({});
  const [showTip, setShowTip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (id: string, quantity: number) => {
    if (quantity <= 0) return;
    const existingItem = cart.find(item => item.id === id);
    const dish = menuItems.find(d => d.id === id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCart([...cart, { id, quantity }]);
    }

    toast.success(`${dish ? t(dish.nameKey as any) : ''} ${t('addedToCart')}`, {
      duration: 2000,
    });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
    toast.info(t('removedFromCart'));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const dish = menuItems.find(d => d.id === item.id);
      return total + (dish?.price || 0) * item.quantity;
    }, 0);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              {t('interactiveMenu')}
            </h1>
            <p className="text-2xl text-gray-500">{t('uzbekKitchen')}</p>
            <p className="text-6xl md:text-7xl font-black" style={{
              color: '#ff0000',
              textShadow: '0 0 20px #ff0000, 0 0 40px #ffff00, 0 0 60px #ff0000'
            }}>
              PlovSpain
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col overflow-y-auto">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 bg-gray-900 rounded-lg p-2 border border-red-500">
        <button
          onClick={() => changeLanguage('ru')}
          className={`px-3 py-1 rounded font-bold transition ${language === 'ru'
            ? 'bg-red-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
        >
          РУ
        </button>
        <button
          onClick={() => changeLanguage('es')}
          className={`px-3 py-1 rounded font-bold transition ${language === 'es'
            ? 'bg-red-600 text-white'
            : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
        >
          ES
        </button>
      </div>

      {variant === "3" && <Variant3 cart={cart} onAddToCart={addToCart} onRemoveFromCart={removeFromCart} totalPrice={getTotalPrice()} currentImageIndex={currentImageIndex} setCurrentImageIndex={setCurrentImageIndex} language={language} t={t} />}
    </div>
  );
}

interface VariantProps {
  cart: CartItem[];
  onAddToCart: (id: string, quantity: number) => void;
  onRemoveFromCart: (id: string) => void;
  totalPrice: number;
  currentImageIndex: { [key: string]: number };
  setCurrentImageIndex: (index: { [key: string]: number }) => void;
  language: Language;
  t: (key: TranslationKey) => string;
}

function Variant3({ cart, onAddToCart, onRemoveFromCart, totalPrice, currentImageIndex, setCurrentImageIndex, language, t }: VariantProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="h-screen w-full flex flex-col relative bg-gradient-to-b from-red-900 via-gray-900 to-red-900">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 text-lg text-red-300 font-black pointer-events-none animate-pulse drop-shadow-lg">
        {t('swipeInstruction')}
      </div>
      <div className="flex-1 overflow-hidden relative" ref={emblaRef}>
        <div className="flex h-full">
          {menuItems.map((dish) => (
            <div key={dish.id} className="min-w-full h-full flex flex-col p-3 gap-2 justify-between">
              <div className="relative group flex-shrink-0 flex-1 overflow-hidden rounded-2xl aspect-square shadow-2xl border-4 border-red-500 transform hover:scale-105 transition">
                <img src={dish.images[currentImageIndex[dish.id] || 0]} alt={t(dish.nameKey as any)} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-black">⭐</div>
                {/* Photo counter */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-bold">
                  {(currentImageIndex[dish.id] || 0) + 1} / {dish.images.length}
                </div>
              </div>
              <div className="flex-shrink-0">
                <h2 className="text-lg font-black text-red-400 mb-0.5">{t(dish.nameKey as any)}</h2>
                <p className="text-gray-300 text-xs mb-1 line-clamp-1">{t(dish.descKey as any)}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-yellow-400">€{dish.price}</span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">{dish.minQuantity}-{dish.maxQuantity}</span>
                </div>
              </div>
              <AddToCartForm dish={dish} onAdd={onAddToCart} variant="dynamic" currentImageIndex={currentImageIndex[dish.id] || 0} totalImages={dish.images.length} onImageChange={(index) => setCurrentImageIndex({ ...currentImageIndex, [dish.id]: index })} language={language} t={t} />
            </div>
          ))}
        </div>
        <button onClick={scrollPrev} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-lg">
          <ChevronLeft size={32} />
        </button>
        <button onClick={scrollNext} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-lg">
          <ChevronRight size={32} />
        </button>
      </div>

      {cart.length > 0 && (
        <div className="flex-shrink-0 bg-gradient-to-t from-black to-red-900 border-t-4 border-red-500 p-3 max-h-1/3 overflow-y-auto">
          <div className="text-red-400 font-black mb-1 text-sm">🔥 {t('cart')} ({cart.length})</div>
          <div className="space-y-0.5 mb-1 text-xs max-h-20 overflow-y-auto">
            {cart.map(item => {
              const dish = menuItems.find(d => d.id === item.id);
              return (
                <div key={item.id} className="flex justify-between items-center text-yellow-300 bg-red-900 p-1 rounded border-l-2 border-red-500 font-bold text-xs">
                  <span>{dish ? t(dish.nameKey as any) : ''} ×{item.quantity}</span>
                  <button onClick={() => onRemoveFromCart(item.id)} className="text-red-300">✕</button>
                </div>
              );
            })}
          </div>
          <div className="border-t-2 border-red-500 pt-1 text-yellow-400 font-black text-sm mb-1">€{totalPrice}</div>
          <CheckoutButtons totalPrice={totalPrice} cart={cart} variant="dynamic" language={language} t={t} />
        </div>
      )}
      {cart.length === 0 && (
        <div className="flex-shrink-0 bg-gradient-to-t from-black to-red-900 border-t-4 border-red-500 p-3 text-center text-gray-500 text-sm">
          {t('addDishesToCart')}
        </div>
      )}
    </div>
  );
}

interface CheckoutButtonsProps {
  totalPrice: number;
  cart: CartItem[];
  variant?: "modern" | "dynamic";
  language: Language;
  t: (key: TranslationKey) => string;
}

function CheckoutButtons({ totalPrice, cart, variant, language, t }: CheckoutButtonsProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    number: '',
    floor: '',
    apartment: ''
  });

  const formatMessage = () => {
    const items = cart.map(item => {
      const dish = menuItems.find(d => d.id === item.id);
      return `${dish ? t(dish.nameKey as any) : ''} x${item.quantity}`;
    }).join('\n');

    const addressText = address.street || address.number || address.floor || address.apartment
      ? `\n\n${t('deliveryAddress')}:\n${address.street} ${address.number}\n${t('floorLabel')} ${address.floor}\n${t('apartmentLabel')} ${address.apartment}`
      : '';

    return `${t('orderItems')}:\n\n${items}\n\n${t('orderTotal')}: €${totalPrice}${addressText}`;
  };

  const handleTelegram = () => {
    const message = encodeURIComponent(formatMessage());
    window.open(`https://t.me/salievr?text=${message}`, '_blank');
    toast.success(t('goingToTelegram'));
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(formatMessage());
    window.open(`https://wa.me/34602478357?text=${message}`, '_blank');
    toast.success(t('goingToWhatsapp'));
  };

  const isAddressValid = address.street && address.number && address.floor && address.apartment;
  const bgColor = "bg-red-600 hover:bg-red-700";

  return (
    <div className="space-y-2">
      {!showOptions && !showAddressForm ? (
        <button onClick={() => setShowAddressForm(true)} className={`w-full ${bgColor} text-white font-bold py-3 rounded-lg transition text-base`}>
          📤 {t('placeOrder')}
        </button>
      ) : showAddressForm ? (
        <div className="space-y-2">
          <input
            type="text"
            placeholder={t('street')}
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder={t('houseNumber')}
            value={address.number}
            onChange={(e) => setAddress({ ...address, number: e.target.value })}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder={t('floor')}
            value={address.floor}
            onChange={(e) => setAddress({ ...address, floor: e.target.value })}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder={t('apartment')}
            value={address.apartment}
            onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded text-sm border border-gray-600 placeholder-gray-500"
          />
          <button
            onClick={() => setShowOptions(true)}
            disabled={!isAddressValid}
            className={`w-full font-bold py-2 rounded-lg text-sm transition ${isAddressValid ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
          >
            ✓ {t('next')}
          </button>
          <button
            onClick={() => {
              setShowAddressForm(false);
              setAddress({ street: '', number: '', floor: '', apartment: '' });
            }}
            className="w-full bg-gray-700 text-white font-bold py-2 rounded-lg text-sm"
          >
            ✕ {t('cancel')}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="bg-gray-800 p-2 rounded text-xs text-gray-300 border border-gray-600">
            <p className="font-bold text-yellow-400 mb-1">📍 {t('deliveryAddress')}:</p>
            <p>{address.street} {address.number}, {t('floorLabel')} {address.floor}, {t('aptLabel')} {address.apartment}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleTelegram} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg text-base hover:bg-blue-700">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.334-.373-.121l-6.869 4.332-2.97-.924c-.644-.213-.658-.644.135-.954l11.593-4.461c.538-.196 1.006.128.832.941z" />
                </svg>
                {t('telegram')}
              </span>
            </button>
            <button onClick={handleWhatsApp} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg text-base hover:bg-green-700">
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-1.325 0-2.651-.402-3.776-1.159L2.67 3.507l1.267 3.218c-.779 1.186-1.19 2.555-1.19 3.972 0 3.355 2.736 6.08 6.104 6.08 1.626 0 3.157-.627 4.306-1.764 1.148-1.136 1.781-2.665 1.781-4.315 0-3.368-2.736-6.102-6.104-6.102M19.52 3.641C17.677 1.797 15.229.75 12.514.75 5.923.75.5 6.175.5 12.766c0 2.25.588 4.458 1.706 6.413L.5 23.25l6.717-2.323c1.926 1.052 4.096 1.606 6.297 1.606 6.591 0 11.996-5.425 11.996-12.016 0-3.21-1.285-6.232-3.491-8.482" />
                </svg>
                {t('whatsapp')}
              </span>
            </button>
          </div>
          <button onClick={() => {
            setShowOptions(false);
            setShowAddressForm(false);
            setAddress({ street: '', number: '', floor: '', apartment: '' });
          }} className="w-full bg-gray-700 text-white font-bold py-2 rounded-lg text-sm">
            ✕ {t('back')}
          </button>
        </div>
      )}
    </div>
  );
}

interface AddToCartFormProps {
  dish: typeof menuItems[0];
  onAdd: (id: string, quantity: number) => void;
  variant?: "modern" | "dynamic";
  currentImageIndex: number;
  totalImages: number;
  onImageChange: (index: number) => void;
  language: Language;
  t: (key: TranslationKey) => string;
}

function AddToCartForm({ dish, onAdd, variant, currentImageIndex, totalImages, onImageChange, language, t }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(dish.minQuantity);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAdd(dish.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
    setQuantity(dish.minQuantity);
  };

  const handlePrevImage = () => {
    onImageChange((currentImageIndex - 1 + totalImages) % totalImages);
  };

  const handleNextImage = () => {
    onImageChange((currentImageIndex + 1) % totalImages);
  };

  const bgColor = "bg-red-600";
  const addedColor = "bg-green-600";

  return (
    <div className="space-y-2">
      {/* Photo navigation */}
      <div className="flex gap-1">
        <button onClick={handlePrevImage} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded text-sm font-bold">
          ← {t('photo')}
        </button>
        <button onClick={handleNextImage} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-1 rounded text-sm font-bold">
          {t('photo')} →
        </button>
      </div>

      <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2 border border-gray-700">
        <button onClick={() => setQuantity(Math.max(dish.minQuantity, quantity - 1))} className="p-1 hover:bg-gray-700 rounded">
          <Minus size={16} className="text-gray-400" />
        </button>
        <span className="text-gray-200 font-bold text-base min-w-8 text-center">{quantity}</span>
        <button onClick={() => setQuantity(Math.min(dish.maxQuantity, quantity + 1))} className="p-1 hover:bg-gray-700 rounded">
          <Plus size={16} className="text-gray-400" />
        </button>
      </div>
      <button onClick={handleAdd} className={`w-full font-bold py-2 rounded-lg text-base transition ${isAdded ? addedColor : bgColor} text-white`}>
        {isAdded ? "✓ " + t('addedStatus') : "🛒 " + t('addToCartHover')}
      </button>
    </div>
  );
}
