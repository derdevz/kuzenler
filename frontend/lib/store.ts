// In-memory data store for customers and shipments
// In production, this would connect to a blockchain or database

// Admin credentials - simple username and password (not hashed for this implementation)
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "Kuzenler2025!",
}

export interface Customer {
  id: string
  walletAddress: string
  name: string
  email: string
  phone: string
  address: string
  createdAt: Date
}

export interface Product {
  id: string
  customerId: string
  name: string
  description: string
  quantity: number
  status: "pending" | "in_transit" | "delivered"
  origin?: string // added origin and destination cities
  destination?: string
  createdAt: Date
}

export interface ShipmentLocation {
  city: string
  country: string
  timestamp: Date
  status: "pending" | "in_transit" | "delivered" | "delayed"
}

export interface Shipment {
  id: string
  customerId: string
  productId: string
  trackingNumber: string
  origin: ShipmentLocation
  destination: ShipmentLocation
  currentLocation: ShipmentLocation
  estimatedDelivery: Date
  route: ShipmentLocation[]
  createdAt: Date
}

export interface Commission {
  id: string
  customerId: string
  productId: string
  shipmentId: string
  amount: number // 0.0001 XLM per product
  quantity: number
  totalAmount: number // amount * quantity
  status: "pending" | "paid"
  createdAt: Date
}

class DataStore {
  private customers: Map<string, Customer> = new Map()
  private products: Map<string, Product> = new Map()
  private shipments: Map<string, Shipment> = new Map()
  private commissions: Map<string, Commission> = new Map()
  private adminWallets: Set<string> = new Set()

  private readonly COMMISSION_PER_PRODUCT = 0.0001 // XLM per product

  constructor() {
    // Admin wallets - varsayılan admin hesapları
    this.adminWallets.add("GBBD47UZM2HO7A7A34DQWBHPUWV3O3F2G4KQWYSZ3VLCHW77RXOVVEHP")
    this.adminWallets.add("GDB32Z2KGWHQIJHFLNFH4K2FG2JKYFZL7STVFXNL3L7K5DQQHPZ4K2")
  }

  private loadAdminConfig() {
    // Client-side only, skip if server-side
    if (typeof window === "undefined") return

    try {
      const config = (window as any).__ADMIN_CONFIG__
      if (config && config.adminWallets && Array.isArray(config.adminWallets)) {
        config.adminWallets.forEach((wallet: string) => {
          this.adminWallets.add(wallet)
        })
        console.log("[v0] Admin wallets loaded:", this.adminWallets.size)
      }
    } catch (error) {
      console.log("[v0] Using default admin wallets")
    }
  }

  isAdmin(walletAddress: string): boolean {
    return this.adminWallets.has(walletAddress)
  }

  // Customer methods
  addCustomer(customer: Omit<Customer, "id" | "createdAt">): Customer {
    const newCustomer: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
      createdAt: new Date(),
    }
    this.customers.set(newCustomer.id, newCustomer)
    return newCustomer
  }

  getCustomerByWallet(walletAddress: string): Customer | undefined {
    return Array.from(this.customers.values()).find((c) => c.walletAddress === walletAddress)
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.get(id)
  }

  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values())
  }

  updateCustomer(id: string, updates: Partial<Customer>): Customer | undefined {
    const customer = this.customers.get(id)
    if (!customer) return undefined
    const updated = { ...customer, ...updates }
    this.customers.set(id, updated)
    return updated
  }

  // Product methods
  addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      createdAt: new Date(),
    }
    this.products.set(newProduct.id, newProduct)

    if (product.origin && product.destination) {
      this.addShipment({
        customerId: product.customerId,
        productId: newProduct.id,
        trackingNumber: `TRK-${Date.now()}`,
        origin: {
          city: product.origin,
          country: "Türkiye",
          timestamp: new Date(),
          status: "pending",
        },
        destination: {
          city: product.destination,
          country: "Türkiye",
          timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "pending",
        },
        currentLocation: {
          city: product.origin,
          country: "Türkiye",
          timestamp: new Date(),
          status: "pending",
        },
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        route: [
          {
            city: product.origin,
            country: "Türkiye",
            timestamp: new Date(),
            status: "pending",
          },
        ],
      })
    }

    return newProduct
  }

  // Var olan bir ürünün durumunu güncelleme fonksiyonu
  updateProductStatus(id: string, status: "pending" | "in_transit" | "delivered"): Product | undefined {
    // 1. Ürünü bul
    const product = this.products.get(id)
    if (!product) return undefined

    // 2. Ürünün durumunu değiştir
    product.status = status
    this.products.set(id, product)

    // 3. (Önemli) Bu ürüne bağlı kargo varsa, onu da güncelle
    // Böylece ürün "Teslim Edildi" olunca kargo takibinde de öyle görünür.
    for (const shipment of this.shipments.values()) {
      if (shipment.productId === id) {
        // Kargo durumunu ürün durumuyla eşle
        // Not: Kargo durumunda "delayed" da var ama üründe yok, o yüzden basit eşleme yapıyoruz.
        let shipmentStatus: "pending" | "in_transit" | "delivered" = status;
        
        shipment.currentLocation.status = shipmentStatus;
        shipment.currentLocation.timestamp = new Date();
        
        // Rota geçmişine de bu hareketi ekle
        shipment.route.push({ 
            city: shipment.currentLocation.city,
            country: shipment.currentLocation.country,
            status: shipmentStatus,
            timestamp: new Date()
        });
        
        this.shipments.set(shipment.id, shipment);
        break; // İlgili kargoyu bulduk, döngüyü bitir.
      }
    }

    return product
  }

  getProduct(id: string): Product | undefined {
    return this.products.get(id)
  }

  getProductsByCustomer(customerId: string): Product[] {
    return Array.from(this.products.values()).filter((p) => p.customerId === customerId)
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const product = this.products.get(id)
    if (!product) return undefined
    const updated = { ...product, ...updates }
    this.products.set(id, updated)
    return updated
  }

  deleteProduct(id: string): boolean {
    const product = this.products.get(id)
    if (!product) return false
    
    // Teslim edilmiş ürünler silinemesin
    if (product.status === "delivered") {
      console.warn("[v0] Cannot delete delivered product:", id)
      return false
    }
    
    return this.products.delete(id)
  }

  // Shipment methods
  addShipment(shipment: Omit<Shipment, "id" | "createdAt">): Shipment {
    const newShipment: Shipment = {
      ...shipment,
      id: `ship_${Date.now()}`,
      createdAt: new Date(),
    }
    this.shipments.set(newShipment.id, newShipment)

    // Sipariş eklenince komisyon oluştur
    const product = this.products.get(newShipment.productId)
    if (product) {
      this.addCommission({
        customerId: newShipment.customerId,
        productId: newShipment.productId,
        shipmentId: newShipment.id,
        amount: this.COMMISSION_PER_PRODUCT,
        quantity: product.quantity,
      })
    }

    return newShipment
  }

  getShipment(id: string): Shipment | undefined {
    return this.shipments.get(id)
  }

  getShipmentsByCustomer(customerId: string): Shipment[] {
    return Array.from(this.shipments.values()).filter((s) => s.customerId === customerId)
  }

  updateShipmentStatus(id: string, status: ShipmentLocation): Shipment | undefined {
    const shipment = this.shipments.get(id)
    if (!shipment) return undefined
    
    // Teslim edilmiş kargolara değişiklik yapılmasını engelle
    if (shipment.currentLocation.status === "delivered") {
      console.warn("[v0] Cannot update delivered shipment:", id)
      return undefined
    }
    
    shipment.currentLocation = status
    shipment.route.push(status)
    this.shipments.set(id, shipment)
    return shipment
  }

  getAllShipments(): Shipment[] {
    return Array.from(this.shipments.values())
  }

  // Commission methods
  private addCommission(commission: Omit<Commission, "id" | "createdAt" | "totalAmount" | "status">) {
    const newCommission: Commission = {
      ...commission,
      id: `comm_${Date.now()}`,
      totalAmount: commission.amount * commission.quantity,
      status: "pending",
      createdAt: new Date(),
    }
    this.commissions.set(newCommission.id, newCommission)
    return newCommission
  }

  getCommissionsByCustomer(customerId: string): Commission[] {
    return Array.from(this.commissions.values()).filter((c) => c.customerId === customerId)
  }

  getTotalCommissions(customerId: string): number {
    return this.getCommissionsByCustomer(customerId).reduce((sum, c) => sum + c.totalAmount, 0)
  }

  getPendingCommissions(): Commission[] {
    return Array.from(this.commissions.values()).filter((c) => c.status === "pending")
  }

  getTotalPendingCommissions(): number {
    return this.getPendingCommissions().reduce((sum, c) => sum + c.totalAmount, 0)
  }

  markCommissionAsPaid(commissionId: string): Commission | undefined {
    const commission = this.commissions.get(commissionId)
    if (commission) {
      commission.status = "paid"
      this.commissions.set(commissionId, commission)
    }
    return commission
  }

  getAllCommissions(): Commission[] {
    return Array.from(this.commissions.values())
  }
}

// Global store instance
export const dataStore = new DataStore()

// Initialize with sample data
function initializeSampleData() {
  const customer1 = dataStore.addCustomer({
    walletAddress: "GDB4K2",
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 555 123 4567",
    address: "İstanbul, Türkiye",
  })

  const customer2 = dataStore.addCustomer({
    walletAddress: "GDFX9L",
    name: "Fatma Öztürk",
    email: "fatma@example.com",
    phone: "+90 555 987 6543",
    address: "Ankara, Türkiye",
  })

  // Sample products and shipments for demonstration
  const product1 = dataStore.addProduct({
    customerId: customer1.id,
    name: "Elektronik Kitap Okuyucu",
    description: "E-ink display, 6 inç, WiFi bağlantı",
    quantity: 2,
    status: "in_transit",
    origin: "Shanghai",
    destination: "İstanbul",
  })

  const product2 = dataStore.addProduct({
    customerId: customer2.id,
    name: "Kablosuz Kulaklık",
    description: "Aktif gürültü engelleme, 30 saat pil ömrü",
    quantity: 1,
    status: "pending",
  })

  // Sample shipments
  dataStore.addShipment({
    customerId: customer1.id,
    productId: product1.id,
    trackingNumber: "TRK001",
    origin: {
      city: "Shanghai",
      country: "Çin",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: "pending",
    },
    destination: {
      city: "İstanbul",
      country: "Türkiye",
      timestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: "in_transit",
    },
    currentLocation: {
      city: "Dubai",
      country: "UAE",
      timestamp: new Date(),
      status: "in_transit",
    },
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    route: [
      {
        city: "Shanghai",
        country: "Çin",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: "pending",
      },
      {
        city: "Hong Kong",
        country: "Hong Kong",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "in_transit",
      },
      {
        city: "Dubai",
        country: "UAE",
        timestamp: new Date(),
        status: "in_transit",
      },
    ],
  })
}

// Initialize sample data on first load
if (typeof window !== "undefined") {
  initializeSampleData()
}
