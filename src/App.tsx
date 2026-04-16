import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useOutletContext,
} from 'react-router-dom'

type Category = 'fish' | 'shellfish'

type Product = {
  name: string
  description: string
  price: number
  unit: string
  category: Category
  image: string
  size: 'wide' | 'small'
}

type CartItem = Product & { qty: number }

const products: Product[] = [
  {
    name: 'Wild-Caught King Salmon',
    description: 'Pristine waters of the Pacific Northwest',
    price: 32,
    unit: '/ lb',
    category: 'fish',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAANXeFa2wQ5iT1jQL3scYY-0GMvFwuBtc5ZXX_PCRG94jBIF8eZCkkjuhRGFUTcV8SNBTfn8EIPjk1yhf7uj-MyCEBltg26L_w6qoCKsxmvLE1CPiVMDoynzjTGYRb0RrE19go3he15VWjgNzi0xhh7KvFNXx-B1vS8Mw3N4dH_yZ3PCoygdhDFSDiNlT9lewZWkpLQWlEiAOJLNuIbB9CbgsQrc_rynAtucC3XF-wswzBiVQORPj5l1N23NIdeJhFoBS5mq2ctYk',
    size: 'wide',
  },
  {
    name: 'Atlantic Blue Oysters',
    description: 'Salty, clean finish',
    price: 18,
    unit: '/ doz',
    category: 'shellfish',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtaPLhraV8fabdl13hQF91At7PQ8LXLSf_EXTmpKO8_wqgXA69jijCBicqc1tLdCUZkaPAAJLlTn8LZSubDWqwzAmKIwq1KIs8aubL3p4ITb6OdsxDObR0zZJBkFTec3qQf9IRJ6vU-Pihb8qi4kJjddE63FJalLiwJD8wA3ip2LabSaf5nGMFFxzci64rt5bViius1-LNC5hqzMXwrdVkACT_jznBM_-SBdUIEsY2N0M5o3u3IyLHCsPHqzTzSdtk8Evn0AZAAZ8',
    size: 'small',
  },
  {
    name: 'Local Gulf Shrimp',
    description: 'Sweet and firm texture',
    price: 24,
    unit: '/ lb',
    category: 'shellfish',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHqLUrFvAUZvksZPlv77O5fMaEVrI467PbbGOMsz9_s6NyI8VyC5n_YSHNrYonM5L_cUxPcrrpjkQAipfkjpBA-G6DbONI5o-ZNDw8cx1_g200R048BBoPo34QZp_U-A8OtOXx-DoK8Ez6r8l9QxGyHcGN6LcgB1cSF5MB3DPLdr41rjYVzs0LQUQtMrVjJ3uA9qE5ousQ8UH6J0Ri6EXmO5wFUf3i1XezEixWcMPp2CDpyfS2TTBn2_Hmy5hnpQxM4Va9L8ExFsk',
    size: 'small',
  },
  {
    name: 'Sea Scallops',
    description: 'Diver-caught, exceptionally sweet',
    price: 28,
    unit: '/ lb',
    category: 'shellfish',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2_qFBRUvkvbWCyXWbvmkTqvMquSMcLUX1fOShh0f0Wtsnz4m1DEQeSC_5uM83U_07TgdZiXOc9sAo2lZNwsQEiq4zXq8Pf4V1KutnjrIOMSjeSs6AGEFXSE7VYyC4fhGY8TrrmIO86N0uvhH55ymrcQ2JP7Igxn5lelNSTy_7X2ZUDKqg74U9MtyP2A_0BMw1ZEFSiibkQx5ieIszpI2HGjHTyJCK0k-4cV8bP-hwJ_xw-xpl7GFLys1shj4LglK9Ptkkc47Gcpk',
    size: 'wide',
  },
]

const recipes = [
  {
    title: 'Herb-Crusted King Salmon',
    time: '15 min',
    description:
      'Simple herb crust with dill, parsley and a squeeze of fresh lemon. Perfect for a quick, healthy weeknight dinner.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAANXeFa2wQ5iT1jQL3scYY-0GMvFwuBtc5ZXX_PCRG94jBIF8eZCkkjuhRGFUTcV8SNBTfn8EIPjk1yhf7uj-MyCEBltg26L_w6qoCKsxmvLE1CPiVMDoynzjTGYRb0RrE19go3he15VWjgNzi0xhh7KvFNXx-B1vS8Mw3N4dH_yZ3PCoygdhDFSDiNlT9lewZWkpLQWlEiAOJLNuIbB9CbgsQrc_rynAtucC3XF-wswzBiVQORPj5l1N23NIdeJhFoBS5mq2ctYk',
  },
  {
    title: 'Garlic Butter Gulf Shrimp',
    time: '10 min',
    description:
      'Succulent shrimp sauteed in garlic butter with a splash of white wine and fresh parsley. Serve over pasta or rice.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCHqLUrFvAUZvksZPlv77O5fMaEVrI467PbbGOMsz9_s6NyI8VyC5n_YSHNrYonM5L_cUxPcrrpjkQAipfkjpBA-G6DbONI5o-ZNDw8cx1_g200R048BBoPo34QZp_U-A8OtOXx-DoK8Ez6r8l9QxGyHcGN6LcgB1cSF5MB3DPLdr41rjYVzs0LQUQtMrVjJ3uA9qE5ousQ8UH6J0Ri6EXmO5wFUf3i1XezEixWcMPp2CDpyfS2TTBn2_Hmy5hnpQxM4Va9L8ExFsk',
  },
  {
    title: 'Pan-Seared Scallops',
    time: '20 min',
    description:
      'Golden-crusted, buttery scallops served on a bed of sweet pea puree. An elegant appetizer or light main course.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2_qFBRUvkvbWCyXWbvmkTqvMquSMcLUX1fOShh0f0Wtsnz4m1DEQeSC_5uM83U_07TgdZiXOc9sAo2lZNwsQEiq4zXq8Pf4V1KutnjrIOMSjeSs6AGEFXSE7VYyC4fhGY8TrrmIO86N0uvhH55ymrcQ2JP7Igxn5lelNSTy_7X2ZUDKqg74U9MtyP2A_0BMw1ZEFSiibkQx5ieIszpI2HGjHTyJCK0k-4cV8bP-hwJ_xw-xpl7GFLys1shj4LglK9Ptkkc47Gcpk',
  },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

type SiteContext = {
  addToCart: (product: Product) => void
}

function SiteLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [cartOpen])

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => setToast(''), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCartOpen(false)
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  )

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart],
  )

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((item) => item.name === product.name)
      if (existing) {
        return current.map((item) =>
          item.name === product.name ? { ...item, qty: item.qty + 1 } : item,
        )
      }

      return [...current, { ...product, qty: 1 }]
    })

    setToast(`${product.name} added to cart`)
  }

  const removeFromCart = (name: string) => {
    setCart((current) => current.filter((item) => item.name !== name))
    setToast(`${name} removed from cart`)
  }

  const outletContext: SiteContext = { addToCart }

  return (
    <div className="min-h-screen bg-[#f4fbf9] font-['Plus_Jakarta_Sans',sans-serif] text-[#161d1c]">
      <a
        href="#main-content"
        className="absolute left-4 top-0 z-[60] -translate-y-full rounded-b-xl bg-[#006a65] px-5 py-3 text-sm font-bold text-white transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 border-b border-white/40 bg-[#ecfdf5]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
          <Link to="/" className="text-2xl font-black tracking-tight text-[#0f766e]">
            Fin & Gill
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <NavLink to="/" end className={navClass}>
              Shop
            </NavLink>
            <NavLink to="/recipes" className={navClass}>
              Recipes
            </NavLink>
            <NavLink to="/about" className={navClass}>
              About Our Fishermen
            </NavLink>
            <a href="/#newsletter" className={linkClass}>
              Newsletter
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative rounded-full p-2 text-[#0f766e] transition hover:bg-[#6ff7ee]/25 active:scale-95"
              aria-label="Open shopping cart"
              onClick={() => setCartOpen(true)}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#fe7e4f] text-[10px] font-black text-[#662200]">
                  {cartCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-[#0f766e] transition hover:bg-[#6ff7ee]/25 active:scale-95"
              aria-label="Account"
            >
              <span className="material-symbols-outlined">account_circle</span>
            </button>

            <button
              type="button"
              className="rounded-full p-2 text-[#0f766e] transition hover:bg-[#6ff7ee]/25 active:scale-95 md:hidden"
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((current) => !current)}
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`${mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden px-6 pb-2 transition-all duration-300 md:hidden`}
        >
          <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow-lg shadow-black/5">
            <NavLink to="/" end className={mobileNavClass}>
              Shop
            </NavLink>
            <NavLink to="/recipes" className={mobileNavClass}>
              Recipes
            </NavLink>
            <NavLink to="/about" className={mobileNavClass}>
              About Our Fishermen
            </NavLink>
            <a href="/#newsletter" className={mobileLinkClass} onClick={() => setMobileOpen(false)}>
              Newsletter
            </a>
          </div>
        </div>
      </header>

      <main id="main-content">
        <Outlet context={outletContext} />
      </main>

      <footer className="mt-20 rounded-t-[3rem] bg-[#d9f99d]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-8 py-16 text-center md:flex-row md:px-12 md:text-left">
          <div className="text-xl font-bold text-[#134e4a]">Fin & Gill</div>
          <nav className="flex flex-wrap justify-center gap-8" aria-label="Footer navigation">
            <Link to="/about" className={footerLinkClass}>
              Sustainability
            </Link>
            <a href="#" className={footerLinkClass}>
              Shipping
            </a>
            <a href="/#newsletter" className={footerLinkClass}>
              Contact
            </a>
            <a href="#" className={footerLinkClass}>
              Terms
            </a>
          </nav>
          <div className="text-xs uppercase tracking-[0.24em] text-[#0f766e]">© 2025 Fin & Gill. Sustainably Sourced.</div>
        </div>
      </footer>

      <div
        className={`${cartOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-50 bg-[#161d1c]/40 transition-opacity`}
        aria-hidden="true"
        onClick={() => setCartOpen(false)}
      />

      <aside
        className={`${cartOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl shadow-black/20 transition-transform duration-300`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-black/5 px-8 py-6">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            type="button"
            className="rounded-full p-2 text-[#3c4948] transition hover:bg-[#e3e9e8]"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {cart.length === 0 ? (
            <p className="py-12 text-center text-[#3c4948]">Your cart is empty. Start shopping!</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.name} className="flex items-center justify-between border-b border-black/5 py-4">
                  <div className="pr-4">
                    <h3 className="text-sm font-bold">{item.name}</h3>
                    <p className="text-xs text-[#3c4948]">
                      ${item.price.toFixed(2)} × {item.qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#006a65]">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      className="rounded-full p-2 text-[#3c4948] transition hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
                      aria-label={`Remove ${item.name} from cart`}
                      onClick={() => removeFromCart(item.name)}
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${cart.length === 0 ? 'hidden' : 'block'} border-t border-black/5 px-8 py-6`}>
          <div className="mb-6 flex items-center justify-between">
            <span className="font-medium text-[#3c4948]">Total</span>
            <span className="text-2xl font-black text-[#006a65]">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className="w-full rounded-full bg-gradient-to-br from-[#006a65] to-[#00b5ad] px-8 py-4 font-bold text-white shadow-lg shadow-[#006a65]/20 transition active:scale-95"
          >
            Checkout
          </button>
        </div>
      </aside>

      {toast ? (
        <div className="fixed bottom-6 right-6 z-[60] rounded-2xl bg-[#161d1c] px-4 py-3 text-sm font-medium text-white shadow-2xl shadow-black/20">
          {toast}
        </div>
      ) : null}
    </div>
  )
}

function HomePage() {
  const { addToCart } = useOutletContext<SiteContext>()
  const [filter, setFilter] = useState<'all' | Category>('all')
  const visibleProducts =
    filter === 'all' ? products : products.filter((product) => product.category === filter)

  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col gap-16 overflow-hidden px-6 pb-24 pt-12 md:flex-row md:items-center md:px-8 md:py-32">
        <div className="w-full md:w-1/2">
          <span className="mb-6 inline-flex rounded-full bg-[#6ff7ee] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-[#00201e]">
            Direct from Source
          </span>
          <h1 className="mb-8 text-5xl font-black leading-[1.05] tracking-tight text-[#161d1c] md:text-7xl">
            Fresh from the <span className="italic text-[#006a65]">Net</span> to Your Door.
          </h1>
          <p className="mb-10 max-w-md text-lg leading-relaxed text-[#3c4948]">
            Experience the ocean&apos;s finest bounty, sustainably harvested and delivered within 24 hours of catch.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#shop"
              className="inline-flex rounded-full bg-gradient-to-br from-[#006a65] to-[#00b5ad] px-10 py-4 font-bold text-white shadow-lg shadow-[#006a65]/20 transition active:scale-95"
            >
              Shop Today&apos;s Catch
            </a>
            <Link
              to="/about"
              className="inline-flex rounded-full bg-[#fe7e4f] px-10 py-4 font-bold text-[#6b1f00] transition hover:brightness-110 active:scale-95"
            >
              Our Story
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-1/2">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#6ff7ee]/20 blur-3xl" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl shadow-black/10 rotate-2 transition-transform duration-700 hover:rotate-0">
            <img
              alt="Gourmet seafood platter with fresh oysters, chilled shrimp, and lemon wedges on a bed of ice"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlvasXY8sKgg9sAoHHYeB1ffwEuhw8bWoIGMweCweQtL887dRTJ1w8libB8lgjG9gpk6tjzQMNV8kCHtUm9H_yvn3fwQ1yBo-Ne-JsqILsZk4BCVBNj9vvYxFTia8UkpExifz4iJxy_IGkct12_k3jGVcnSwOK2t9Fa90GmCU71XgB2Lz3L5LU5bFVZgSKq71JayLT7z3tqIM6mCtiz8u1Sx0zsWRZhutZarC_befg-y4trpYiwV0PSaZWAXqfQBtiDXk-lsFazMc"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 hidden max-w-[200px] rounded-2xl border border-white/40 bg-white p-6 shadow-xl shadow-black/10 md:block">
            <div className="mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined fill-1 text-[#a43c12]">stars</span>
              <span className="text-xs font-bold text-[#161d1c]">Daily Freshness</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#3c4948]">Verified Sustainable</p>
          </div>
        </div>
      </section>

      <section id="shop" className="rounded-t-3xl bg-[#eff5f3] py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-black tracking-tight md:text-5xl">The Daily Catch</h2>
              <p className="max-w-md text-[#3c4948]">Hand-selected by our experts this morning. Limited quantities available.</p>
            </div>

            <div className="flex gap-2" role="tablist" aria-label="Product category filter">
              <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                All
              </FilterButton>
              <FilterButton active={filter === 'fish'} onClick={() => setFilter('fish')}>
                Fish
              </FilterButton>
              <FilterButton active={filter === 'shellfish'} onClick={() => setFilter('shellfish')}>
                Shellfish
              </FilterButton>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {visibleProducts.map((product) => (
              <ProductCard key={product.name} product={product} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section id="newsletter" className="px-6 py-24 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-white/50 bg-white p-8 shadow-lg shadow-black/5 md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#006a65] to-[#00b5ad]">
              <span className="material-symbols-outlined text-3xl text-white">mail</span>
            </div>
            <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">Stay in the Current</h2>
            <p className="mb-8 leading-relaxed text-[#3c4948]">
              Get weekly catch updates, seasonal recipes, and exclusive offers delivered straight to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-16 md:flex-row md:items-center md:px-8 md:py-24">
        <div className="w-full md:w-1/2">
          <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Respecting the <span className="italic text-[#006a65]">Ocean</span> for Generations
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[#3c4948]">
            At Fin & Gill, we believe that the best seafood comes from those who treat the water with respect. We bypass the
            massive commercial operations and partner exclusively with independent, generational fishermen who use sustainable
            harvesting methods.
          </p>
          <p className="mb-8 text-lg leading-relaxed text-[#3c4948]">
            By cutting out the middlemen, we ensure that our coastal partners are paid fairly for their hard work, and you
            get access to the freshest catch possible, often delivered to your door within 24 hours of leaving the water.
          </p>
          <div className="flex items-center gap-4 font-bold text-[#006a65]">
            <span className="material-symbols-outlined text-3xl">verified</span>
            100% Traceable Catch
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl shadow-black/10">
            <div className="absolute inset-x-0 bottom-0 top-1/2 z-10 bg-gradient-to-t from-black/60 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80"
              alt="Fisherman standing on a dock with nets"
              className="h-full w-full object-cover object-top"
            />
            <div className="absolute bottom-6 left-6 z-20">
              <h2 className="text-xl font-bold text-white">Matěj Rybář</h2>
              <p className="text-sm text-white/80">Very capable fisherman and active student</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-t-3xl bg-[#eff5f3] py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 gap-16 text-center md:grid-cols-3">
            <ValueCard icon="set_meal" title="Sustainably Caught" color="primary">
              No bottom trawling. No overfished species. Only line-caught or sustainably farmed seafood that respects ocean ecosystems.
            </ValueCard>
            <ValueCard icon="local_shipping" title="Cold-Chain Fresh" color="secondary">
              Temperature-controlled from the dock to your door. We ensure our catch stays below peak temperatures to maintain just-caught quality.
            </ValueCard>
            <ValueCard icon="cooking" title="Chef-Ready Quality" color="primary">
              The same premium cuts and whole fish preferred by the region&apos;s top seafood restaurants, now available to home cooks.
            </ValueCard>
          </div>
        </div>
      </section>
    </>
  )
}

function RecipesPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-5xl font-black tracking-tight md:text-6xl">
          Our Favorite <span className="italic text-[#006a65]">Recipes</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[#3c4948]">
          Learn how to prepare your fresh catch with these simple, chef-approved recipes that let the natural flavor of the seafood shine.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <article
            key={recipe.title}
            className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[#006a65]/5"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#a43c12] backdrop-blur-sm">
                {recipe.time}
              </div>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h2 className="mb-3 text-2xl font-bold">{recipe.title}</h2>
              <p className="mb-6 text-sm leading-relaxed text-[#3c4948]">{recipe.description}</p>
              <a href="#" className="inline-flex items-center gap-2 font-bold text-[#006a65] transition-colors hover:text-[#a43c12]">
                Read Recipe <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </article>
        ))}

        <article className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
          <div className="relative flex aspect-[16/10] items-center justify-center bg-[#dde4e2]">
            <span className="material-symbols-outlined text-6xl text-[#bbc9c7]">set_meal</span>
          </div>
          <div className="p-6">
            <div className="mb-4 h-4 w-16 rounded-full bg-[#dde4e2]" />
            <div className="mb-3 h-6 w-3/4 rounded-full bg-[#dde4e2]" />
            <div className="mb-6 h-20 w-full rounded-2xl bg-[#dde4e2]" />
            <div className="h-4 w-24 rounded-full bg-[#dde4e2]" />
          </div>
        </article>
      </div>
    </main>
  )
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`${active ? 'bg-[#6ff7ee] text-[#00201e]' : 'bg-[#dde4e2] text-[#3c4948]'} rounded-full px-4 py-2 text-xs font-bold transition-colors`}
    >
      {children}
    </button>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const wideClass = product.size === 'wide' ? 'md:col-span-8' : 'md:col-span-4'
  const aspectClass = product.size === 'wide' ? 'aspect-[16/9]' : 'aspect-square'
  const titleClass = product.size === 'wide' ? 'text-2xl' : 'text-lg'
  const descClass = product.size === 'wide' ? 'text-sm mb-4' : 'text-xs mb-3'
  const priceClass = product.size === 'wide' ? 'text-xl' : 'text-lg'

  return (
    <article className={`${wideClass} group overflow-hidden rounded-3xl bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-[#006a65]/5`}>
      <div className={`${aspectClass} mb-6 overflow-hidden rounded-2xl`}>
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex items-start justify-between gap-4 px-4 pb-4">
        <div>
          <h3 className={`${titleClass} mb-2 font-bold`}>{product.name}</h3>
          <p className={`${descClass} text-[#3c4948]`}>{product.description}</p>
          <span className={`${priceClass} font-black text-[#006a65]`}>
            ${product.price.toFixed(2)} <span className="text-sm font-medium text-[#3c4948]">{product.unit}</span>
          </span>
        </div>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fe7e4f] text-[#6b1f00] transition hover:scale-110 active:scale-95"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAdd(product)}
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>
    </article>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    setError('')
    setSuccess('')

    if (!trimmed) {
      setError('Please enter your email address.')
      return
    }

    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setSuccess(`Welcome aboard! We'll send updates to ${trimmed}.`)
    setEmail('')
  }

  return (
    <form className="flex flex-col gap-4 sm:flex-row" onSubmit={submitForm} noValidate>
      <div className="flex-1 text-left">
        <label htmlFor="email-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-input"
          type="email"
          placeholder="your@email.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full border border-[#dde4e2] bg-[#eff5f3] px-6 py-4 text-[#161d1c] outline-none transition focus:border-[#006a65] focus:ring-2 focus:ring-[#006a65]/20"
        />
        {error ? <p className="ml-4 mt-2 text-xs text-[#ba1a1a]">{error}</p> : null}
      </div>
      <button
        type="submit"
        className="rounded-full bg-gradient-to-br from-[#006a65] to-[#00b5ad] px-8 py-4 font-bold text-white shadow-lg shadow-[#006a65]/20 transition active:scale-95 whitespace-nowrap"
      >
        Subscribe
      </button>
      {success ? <p className="sm:col-span-2 text-left font-bold text-[#006a65]">{success}</p> : null}
    </form>
  )
}

function ValueCard({
  icon,
  title,
  color,
  children,
}: {
  icon: string
  title: string
  color: 'primary' | 'secondary'
  children: string
}) {
  const colorClass = color === 'primary' ? 'bg-[#6ff7ee]/30 text-[#006a65]' : 'bg-[#ffdbcf]/40 text-[#a43c12]'

  return (
    <div className="flex flex-col items-center">
      <div className={`${colorClass} mb-6 flex h-16 w-16 items-center justify-center rounded-full`} aria-hidden="true">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      <p className="text-sm leading-relaxed text-[#3c4948]">{children}</p>
    </div>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? 'border-b-2 border-[#fe7e4f] font-bold text-[#0f766e]' : 'font-medium text-[#134e4a]/70'} text-sm tracking-tight transition-colors hover:text-[#a43c12]`

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? 'bg-[#6ff7ee]/20 font-bold text-[#0f766e]' : 'text-[#134e4a]/70'} rounded-xl px-4 py-3 text-sm transition-colors hover:bg-[#6ff7ee]/20`

const linkClass = 'text-sm font-medium tracking-tight text-[#134e4a]/70 transition-colors hover:text-[#a43c12]'
const mobileLinkClass = 'rounded-xl px-4 py-3 text-sm text-[#134e4a]/70 transition-colors hover:bg-[#6ff7ee]/20 hover:text-[#0f766e]'
const footerLinkClass = 'text-xs uppercase tracking-[0.24em] text-[#134e4a]/60 opacity-80 transition-opacity hover:underline hover:opacity-100'

export default App
