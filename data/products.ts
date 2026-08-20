import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'aiko-neostar-600w',
    name: 'Tấm pin mặt trời Aiko Neostar 600W',
    code: 'AIKO-600W',
    slug: 'aiko-neostar-600w',
    description:
      'Tấm pin năng lượng mặt trời Aiko Neostar sử dụng công nghệ ABC (All Back Contact) tiên tiến, mang lại hiệu suất chuyển đổi năng lượng vượt trội và thiết kế sang trọng, không bo kenh trên mặt trước.',
    image:
      'https://images.pexels.com/photos/9875411/pexels-photo-9875411.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 2200000,
    unit: 'tấm',
    category: 'Tấm pin',
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
    specifications: {
      'Công suất': '600W',
      'Công nghệ': 'ABC (All Back Contact)',
      'Hiệu suất': '23.6%',
      'Kích thước': '2278 × 1134 × 30mm',
      'Bảo hành': '15 năm sản phẩm / 30 năm công suất',
    },
  },
  {
    id: 'longi-himo6-580w',
    name: 'Tấm pin mặt trời Longi Hi-MO 6 580W',
    code: 'LONGI-580W',
    slug: 'longi-himo6-580w',
    description:
      'Tấm pin Longi Hi-MO 6 tích hợp công nghệ HPBC độc quyền, hoạt động ổn định trong điều kiện ánh sáng yếu, phù hợp khí hậu Việt Nam.',
    image:
      'https://images.pexels.com/photos/9875405/pexels-photo-9875405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1850000,
    unit: 'tấm',
    category: 'Tấm pin',
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
    specifications: {
      'Công suất': '580W',
      'Công nghệ': 'HPBC',
      'Hiệu suất': '22.6%',
      'Kích thước': '2278 × 1134 × 30mm',
      'Bảo hành': '15 năm sản phẩm / 25 năm công suất',
    },
  },
  {
    id: 'ja-solar-deepblue-580w',
    name: 'Tấm pin mặt trời JA Solar DeepBlue 4.0 580W',
    code: 'JASOLAR-580W',
    slug: 'ja-solar-deepblue-580w',
    description:
      'Tấm pin JA Solar DeepBlue 4.0 cho hiệu suất cao và độ tin cậy vượt trội, được thiết kế tối ưu cho các hệ thống điện mặt trời áp mái và nhà xưởng.',
    image:
      'https://images.pexels.com/photos/6961122/pexels-photo-6961122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1750000,
    unit: 'tấm',
    category: 'Tấm pin',
    isFeatured: false,
    isActive: true,
    sortOrder: 3,
    specifications: {
      'Công suất': '580W',
      'Công nghệ': 'PERC',
      'Hiệu suất': '22.3%',
      'Kích thước': '2278 × 1134 × 35mm',
      'Bảo hành': '12 năm sản phẩm / 25 năm công suất',
    },
  },
  {
    id: 'huawei-sun2000-10ktl',
    name: 'Inverter Huawei SUN2000-10KTL-M1',
    code: 'HUAWEI-10KTL',
    slug: 'huawei-sun2000-10ktl-m1',
    description:
      'Inverter Huawei SUN2000 10KTL-M1 ba pha tích hợp công nghệ tối ưu hóa thông minh, hỗ trợ ba MPPT cho hiệu suất phát điện tối đa trong mọi điều kiện thời tiết.',
    image:
      'https://images.pexels.com/photos/38171130/pexels-photo-38171130.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 28000000,
    unit: 'bộ',
    category: 'Inverter',
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
    specifications: {
      'Công suất định mức': '10kW',
      'Số pha': '3 pha',
      'Số MPPT': '3',
      'Hiệu suất tối đa': '98.7%',
      'Bảo hành': '5 năm',
    },
  },
  {
    id: 'sungrow-12ktl',
    name: 'Inverter Sungrow 12KTL-S2',
    code: 'SUNGROW-12KTL',
    slug: 'sungrow-12ktl-s2',
    description:
      'Inverter Sungrow 12KTL-S2 thiết kế nhỏ gọn, hoạt động bền bỉ với khả năng chịu nhiệt tốt, tích hợp bảo vệ an toàn Arc Fault (AFCI) chống cháy nổ.',
    image:
      'https://images.pexels.com/photos/38171111/pexels-photo-38171111.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 24000000,
    unit: 'bộ',
    category: 'Inverter',
    isFeatured: false,
    isActive: true,
    sortOrder: 5,
    specifications: {
      'Công suất định mức': '12kW',
      'Số pha': '3 pha',
      'Số MPPT': '2',
      'Hiệu suất tối đa': '98.5%',
      'Bảo hành': '5 năm',
    },
  },
  {
    id: 'growatt-mod-8ktl',
    name: 'Inverter Growatt MOD 8KTL3-X',
    code: 'GROWATT-8KTL',
    slug: 'growatt-mod-8ktl3-x',
    description:
      'Inverter Growatt MOD 8KTL3-X ba pha tối ưu cho hộ gia đình và doanh nghiệp nhỏ, giao diện trực quan dễ theo dõi qua ứng dụng ShinePhone.',
    image:
      'https://images.pexels.com/photos/9800025/pexels-photo-9800025.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 18000000,
    unit: 'bộ',
    category: 'Inverter',
    isFeatured: false,
    isActive: true,
    sortOrder: 6,
    specifications: {
      'Công suất định mức': '8kW',
      'Số pha': '3 pha',
      'Số MPPT': '2',
      'Hiệu suất tối đa': '98.4%',
      'Bảo hành': '5 năm',
    },
  },
  {
    id: 'byd-battery-box-hvs-5k',
    name: 'Pin lưu trữ BYD Battery-Box HVS 5.1kWh',
    code: 'BYD-HVS-5K',
    slug: 'byd-battery-box-hvs-5k',
    description:
      'Hệ thống pin lưu trữ BYD Battery-Box HVS thiết kế module linh hoạt, sử dụng cell LFP an toàn và bền bỉ, mở rộng dung lượng dễ dàng theo nhu cầu.',
    image:
      'https://images.pexels.com/photos/39057090/pexels-photo-39057090.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 35000000,
    unit: 'bộ',
    category: 'Pin lưu trữ',
    isFeatured: true,
    isActive: true,
    sortOrder: 7,
    specifications: {
      'Dung lượng': '5.12 kWh',
      'Công nghệ': 'LFP (Lithium Iron Phosphate)',
      'Số chu kỳ': '6000 chu kỳ',
      'Mở rộng': 'Tối đa 25.6 kWh',
      'Bảo hành': '10 năm',
    },
  },
  {
    id: 'pylontech-us5000',
    name: 'Pin lưu trữ Pylontech US5000 4.8kWh',
    code: 'PYLON-US5000',
    slug: 'pylontech-us5000',
    description:
      'Pin Pylontech US5000 dung lượng 4.8kWh, công nghệ LFP an toàn, tương thích đa dạng inverter trên thị trường, lý tưởng cho hệ thống lưu trữ gia đình.',
    image:
      'https://images.pexels.com/photos/36085816/pexels-photo-36085816.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 28000000,
    unit: 'bộ',
    category: 'Pin lưu trữ',
    isFeatured: false,
    isActive: true,
    sortOrder: 8,
    specifications: {
      'Dung lượng': '4.8 kWh',
      'Công nghệ': 'LFP',
      'Số chu kỳ': '6000 chu kỳ',
      'Mở rộng': 'Tối đa 14.4 kWh',
      'Bảo hành': '7 năm',
    },
  },
  {
    id: 'gpg-mounting-kit',
    name: 'Bộ khung giá đỡ inox GPG',
    code: 'GPG-MOUNT-KIT',
    slug: 'gpg-mounting-kit',
    description:
      'Khung giá đỡ inox cao cấp chống rỉ sét, phù hợp mọi loại mái (mái tôn, mái bê tông, mái bằng). Bao gồm đầy phụ kiện lắp ráp.',
    image:
      'https://images.pexels.com/photos/11645008/pexels-photo-11645008.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 1200000,
    unit: 'bộ',
    category: 'Phụ kiện',
    isFeatured: false,
    isActive: true,
    sortOrder: 9,
    specifications: {
      'Vật liệu': 'Inox 304 / nhôm hợp kim Anode',
      'Ứng dụng': 'Mái tôn, mái bê tông, mái bằng',
      'Bảo hành': '10 năm',
    },
  },
  {
    id: 'gpg-cable-ac-dc',
    name: 'Dây cáp AC/DC năng lượng mặt trời GPG',
    code: 'GPG-CABLE',
    slug: 'gpg-cable-ac-dc',
    description:
      'Dây cáp AC/DC chuyên dụng cho hệ thống điện mặt trời, lõi đồng đạt chuẩn, lớp vỏ chống UV chịu nhiệt tốt, an toàn khi lắp đặt ngoài trời.',
    image:
      'https://images.pexels.com/photos/29206488/pexels-photo-29206488.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    price: 180000,
    unit: 'cuộn',
    category: 'Phụ kiện',
    isFeatured: false,
    isActive: true,
    sortOrder: 10,
    specifications: {
      'Tiết diện': '4mm² / 6mm²',
      'Chiều dài': '100m / cuộn',
      'Chống UV': 'Có',
      'Bảo hành': '2 năm',
    },
  },
];

export const productCategories: string[] = Array.from(
  new Set(products.filter((p) => p.isActive).map((p) => p.category))
).sort();

export function getActiveProducts(): Product[] {
  return products
    .filter((p) => p.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.isActive);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id && p.isActive);
}
