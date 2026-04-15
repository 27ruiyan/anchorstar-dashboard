import { NewsArticle } from '@/types/sentiment'

export const mockNews: Record<string, NewsArticle[]> = {
  kodansha: [
    // Global articles
    {
      id: 'mock-kodansha-g1',
      title: "Kodansha's Attack on Titan Live-Action Film Breaks Box Office Records",
      source: 'Variety',
      url: 'https://example.com/kodansha-attack-on-titan-box-office',
      publishedAt: '2026-04-10',
      snippet: "The live-action adaptation of Kodansha's flagship manga continues to dominate global box offices, generating over $500 million in revenue and reigniting interest in the original manga series.",
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-kodansha-g2',
      title: 'Manga Publishers Face New AI Copyright Challenges',
      source: 'Reuters',
      url: 'https://example.com/manga-ai-copyright-challenges',
      publishedAt: '2026-04-08',
      snippet: 'Industry leaders including Kodansha are joining legal efforts to combat AI companies training generative models on copyrighted manga without permission, marking a critical battle for IP protection.',
      region: 'global',
      sentiment: 'mixed'
    },
    {
      id: 'mock-kodansha-g3',
      title: 'Kodansha Reports Digital Revenue Growth Amid Print Decline',
      source: 'Bloomberg',
      url: 'https://example.com/kodansha-digital-growth',
      publishedAt: '2026-04-05',
      snippet: "Kodansha's quarterly earnings reveal a 35% increase in digital manga subscriptions and licensing fees, though traditional magazine revenue continues to decline in mature markets.",
      region: 'global',
      sentiment: 'mixed'
    },
    {
      id: 'mock-kodansha-g4',
      title: 'Fairy Tail Mobile Game Shut Down Amid Poor User Retention',
      source: 'Game Insider',
      url: 'https://example.com/fairy-tail-mobile-shutdown',
      publishedAt: '2026-04-02',
      snippet: 'Kodansha announced the closure of its Fairy Tail mobile game after failing to attract sustainable user engagement, highlighting challenges in gaming IP adaptation.',
      region: 'global',
      sentiment: 'negative'
    },
    // Japan articles
    {
      id: 'mock-kodansha-j1',
      title: '講談社、デジタルマンガプラットフォームで1000万ユーザー突破',
      source: '日本経済新聞',
      url: 'https://example.com/kodansha-digital-million-users',
      publishedAt: '2026-04-11',
      snippet: '講談社のデジタルマンガプラットフォームが1000万ユーザーを突破。若年層による利用が増加し、出版社の事業構造転換を加速させている。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kodansha-j2',
      title: '雑誌出版業界、紙媒体の収益性悪化で構造改革加速',
      source: '朝日新聞',
      url: 'https://example.com/magazine-industry-reform',
      publishedAt: '2026-04-09',
      snippet: '講談社を含む主要出版社が紙媒体事業の縮小を推し進めており、編集部の再編成と高度人材の確保が課題となっている。',
      region: 'japan',
      sentiment: 'negative'
    },
    {
      id: 'mock-kodansha-j3',
      title: '講談社とテレビ局、アニメ制作で新展開',
      source: '東洋経済',
      url: 'https://example.com/kodansha-anime-partnership',
      publishedAt: '2026-04-06',
      snippet: '講談社が国内大手テレビ局と複数のアニメ化プロジェクトで提携。IPの多角化展開とグローバルマーケティングを強化する。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kodansha-j4',
      title: 'マンガ家の権利保護で業界団体が新基準策定',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/manga-creators-rights',
      publishedAt: '2026-04-03',
      snippet: '講談社ら出版社団体がマンガ家の著作権保護と取り分改善に関する新基準を策定。クリエイター離脱防止への施策。',
      region: 'japan',
      sentiment: 'neutral'
    }
  ],
  persol: [
    // Global articles
    {
      id: 'mock-persol-g1',
      title: 'PERSOL Group Expands Southeast Asia Operations with New $200M Investment',
      source: 'Financial Times',
      url: 'https://example.com/persol-southeast-asia-expansion',
      publishedAt: '2026-04-12',
      snippet: 'PERSOL Group announced a major investment in Southeast Asian staffing and HR tech operations, targeting rapid growth in emerging markets with digital-first workforce solutions.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-persol-g2',
      title: 'AI Recruitment Tools Disrupt Traditional Staffing Industry',
      source: 'TechCrunch',
      url: 'https://example.com/ai-recruitment-disruption',
      publishedAt: '2026-04-07',
      snippet: 'Startups offering AI-powered recruitment are challenging traditional staffing giants like PERSOL, automating candidate screening and matching in ways that reduce demand for human recruiters.',
      region: 'global',
      sentiment: 'negative'
    },
    {
      id: 'mock-persol-g3',
      title: "PERSOL's HR Tech Platform Gains Corporate Clients Amid Talent Shortage",
      source: 'Human Resources Today',
      url: 'https://example.com/persol-hr-tech-growth',
      publishedAt: '2026-04-04',
      snippet: "PERSOL Group's proprietary HR technology platform attracted 150 new enterprise customers this quarter, leveraging growing demand for integrated talent management solutions.",
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-persol-g4',
      title: "Japan's Demographic Crisis Threatens Staffing Industry Growth",
      source: 'The Economist',
      url: 'https://example.com/japan-demographic-staffing',
      publishedAt: '2026-03-31',
      snippet: "With Japan's workforce shrinking 500,000 annually, staffing companies like PERSOL face structural headwinds despite automation investments and overseas expansion efforts.",
      region: 'global',
      sentiment: 'mixed'
    },
    // Japan articles
    {
      id: 'mock-persol-j1',
      title: 'パーソルグループ、HRテック事業で時給管理システムが大手企業に採用',
      source: '日本経済新聞',
      url: 'https://example.com/persol-hr-tech-adoption',
      publishedAt: '2026-04-13',
      snippet: 'パーソルグループが開発した勤務時間管理・給与計算システムが国内大手50社以上に採用。HRテック事業の拡大を加速。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-persol-j2',
      title: '人材派遣業界、2026年第1四半期で初のマイナス成長',
      source: '朝日新聞',
      url: 'https://example.com/staffing-negative-growth',
      publishedAt: '2026-04-08',
      snippet: 'パーソルを含む大手人材派遣企業の派遣労働者数が前年同期比で2.3%減少。製造業からの引き合い減少が主因。',
      region: 'japan',
      sentiment: 'negative'
    },
    {
      id: 'mock-persol-j3',
      title: 'パーソル、Z世代向けキャリア開発アプリを新展開',
      source: '東洋経済',
      url: 'https://example.com/persol-gen-z-career-app',
      publishedAt: '2026-04-05',
      snippet: 'パーソルグループが若年層のキャリア開発を支援するスマートフォンアプリを全国展開。教育機関と連携した新規事業。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-persol-j4',
      title: '労働基準法改正で派遣業界に規制強化の動き',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/labor-law-staffing-regulation',
      publishedAt: '2026-04-01',
      snippet: '政府が派遣労働者の権利保護強化を検討。パーソルなど大手企業のビジネスモデルに影響を及ぼす可能性。',
      region: 'japan',
      sentiment: 'mixed'
    }
  ],
  'ntt-east': [
    // Global articles
    {
      id: 'mock-ntt-east-g1',
      title: 'NTT East Completes 5G Network Rollout Across Tokyo Metropolitan Area',
      source: 'Telecommunications Review',
      url: 'https://example.com/ntt-east-5g-rollout',
      publishedAt: '2026-04-11',
      snippet: 'NTT East announced the completion of its comprehensive 5G network deployment across Tokyo and surrounding prefectures, targeting enterprise and IoT applications.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-ntt-east-g2',
      title: "Japan's Fixed-Line Telecom Sector Faces Structural Decline",
      source: 'Bloomberg',
      url: 'https://example.com/japan-fixed-line-decline',
      publishedAt: '2026-04-09',
      snippet: 'Despite infrastructure investments, Japanese fixed-line carriers like NTT East see revenue decline as consumers and enterprises shift to mobile-first connectivity.',
      region: 'global',
      sentiment: 'negative'
    },
    {
      id: 'mock-ntt-east-g3',
      title: 'NTT East Smart City Initiative Gains Traction in Regional Japan',
      source: 'Asian Infrastructure Weekly',
      url: 'https://example.com/ntt-east-smart-city',
      publishedAt: '2026-04-06',
      snippet: "NTT East's smart city and DX consulting services secured contracts with 8 additional municipalities, leveraging its infrastructure backbone and domain expertise.",
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-ntt-east-g4',
      title: 'Fiber Infrastructure Investment Faces Diminishing Returns',
      source: 'Reuters',
      url: 'https://example.com/fiber-infrastructure-returns',
      publishedAt: '2026-04-02',
      snippet: "Analysts question the ROI of NTT East's ongoing fiber buildout investments in a market where mobile-only households and businesses continue to grow.",
      region: 'global',
      sentiment: 'mixed'
    },
    // Japan articles
    {
      id: 'mock-ntt-east-j1',
      title: 'NTT東日本、地方自治体向けDXソリューション事業が好調',
      source: '日本経済新聞',
      url: 'https://example.com/ntt-east-municipal-dx',
      publishedAt: '2026-04-12',
      snippet: 'NTT東日本が地方自治体向けデジタルトランスフォーメーション支援事業で前年度比40%の売上増加を達成。地方創生への貢献が評価される。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-ntt-east-j2',
      title: '固定電話加入者数、過去最大の減少率を記録',
      source: '朝日新聞',
      url: 'https://example.com/fixed-phone-decline',
      publishedAt: '2026-04-10',
      snippet: 'NTT東日本を含む大手通信事業者の固定電話加入者が昨年度比7%減少。若年層ほぼ全員がモバイル利用に移行。',
      region: 'japan',
      sentiment: 'negative'
    },
    {
      id: 'mock-ntt-east-j3',
      title: 'NTT東日本、光ファイバー網の利活用で企業向けサービス強化',
      source: '東洋経済',
      url: 'https://example.com/ntt-east-fiber-enterprise',
      publishedAt: '2026-04-07',
      snippet: 'NTT東日本が既設光ファイバーネットワークを活用した企業向けICTソリューションを拡充。データセンター事業との統合により利幅改善へ。',
      region: 'japan',
      sentiment: 'neutral'
    },
    {
      id: 'mock-ntt-east-j4',
      title: '通信業界の規制強化で料金競争が激化',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/telecom-regulation-competition',
      publishedAt: '2026-04-03',
      snippet: '政府の通信料金規制強化により、NTT東日本など大手キャリアの利幅圧縮が進行。事業モデルの転換が急務に。',
      region: 'japan',
      sentiment: 'negative'
    }
  ],
  kikkoman: [
    // Global articles
    {
      id: 'mock-kikkoman-g1',
      title: 'Kikkoman Wins Global Sustainability Certification for Soy Production',
      source: 'Food Production Weekly',
      url: 'https://example.com/kikkoman-sustainability',
      publishedAt: '2026-04-13',
      snippet: 'Kikkoman received top-tier sustainability certification for its soy sourcing and production practices, positioning the brand favorably with Gen Z and health-conscious consumers.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-kikkoman-g2',
      title: 'Plant-Based Protein Industry Disrupts Traditional Seasoning Market',
      source: 'FoodTech Insights',
      url: 'https://example.com/plant-based-disruption',
      publishedAt: '2026-04-08',
      snippet: 'Rising plant-based eating trends create both opportunity and risk for traditional fermented food brands like Kikkoman as consumers seek alternative seasonings.',
      region: 'global',
      sentiment: 'mixed'
    },
    {
      id: 'mock-kikkoman-g3',
      title: 'Kikkoman Expands Wellness-Focused Product Line in US Market',
      source: 'Brandwatch',
      url: 'https://example.com/kikkoman-wellness-expansion',
      publishedAt: '2026-04-05',
      snippet: 'Kikkoman launched low-sodium and probiotic-enriched soy sauce variants targeting US health-conscious consumers, capitalizing on fermented food popularity.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-kikkoman-g4',
      title: 'Global Commodity Prices Pressure Food Manufacturer Margins',
      source: 'Reuters',
      url: 'https://example.com/commodity-prices-food-margins',
      publishedAt: '2026-04-01',
      snippet: 'Soy and salt price volatility threatens profit margins for food producers including Kikkoman, despite strong global demand.',
      region: 'global',
      sentiment: 'negative'
    },
    // Japan articles
    {
      id: 'mock-kikkoman-j1',
      title: 'キッコーマン、海外売上が日本国内を上回る',
      source: '日本経済新聞',
      url: 'https://example.com/kikkoman-global-sales',
      publishedAt: '2026-04-14',
      snippet: 'キッコーマンの海外事業売上が国内事業を初めて上回り、グローバル企業としての転換点を迎える。北米とアジアで特に好調。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kikkoman-j2',
      title: '発酵食品市場で中小メーカーとの競争激化',
      source: '朝日新聞',
      url: 'https://example.com/fermented-food-competition',
      publishedAt: '2026-04-11',
      snippet: 'キッコーマンのような大手と異なり、個性的な発酵食品を生産する中小メーカーが若年層に人気。マーケット侵食が進む。',
      region: 'japan',
      sentiment: 'mixed'
    },
    {
      id: 'mock-kikkoman-j3',
      title: 'キッコーマン、機能性食品分野で新製品開発加速',
      source: '東洋経済',
      url: 'https://example.com/kikkoman-functional-foods',
      publishedAt: '2026-04-09',
      snippet: 'キッコーマンが腸内環境改善や免疫力向上に訴求した機能性醤油・調味料の開発を加速。健康志向の消費者層に向けた新展開。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kikkoman-j4',
      title: '大豆調達でESG対応強化、サプライチェーン課題に対応',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/kikkoman-esg-supply-chain',
      publishedAt: '2026-04-06',
      snippet: 'キッコーマンがトレーサビリティ強化と持続可能な大豆調達に投資。環境・社会配慮型企業としてのブランド価値向上を狙う。',
      region: 'japan',
      sentiment: 'neutral'
    }
  ],
  kirin: [
    // Global articles
    {
      id: 'mock-kirin-g1',
      title: 'Kirin Holdings Doubles Down on Non-Alcoholic Beverage Innovation',
      source: 'Beverage Daily',
      url: 'https://example.com/kirin-non-alcoholic',
      publishedAt: '2026-04-12',
      snippet: 'Kirin announced major R&D investments in non-alcoholic and low-alcohol beer variants, responding to Gen Z abstention trends and health-conscious consumer preferences.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-kirin-g2',
      title: 'Beer Industry Faces Long-Term Structural Decline in Developed Markets',
      source: 'Financial Times',
      url: 'https://example.com/beer-industry-decline',
      publishedAt: '2026-04-10',
      snippet: "Traditional beer consumption continues declining in Japan and Australia, Kirin's core markets, challenging the company's diversification efforts despite health science pivot.",
      region: 'global',
      sentiment: 'negative'
    },
    {
      id: 'mock-kirin-g3',
      title: 'Kirin Health Science Division Reports Strong Quarter Amid Pharmaceutical Growth',
      source: 'Global Pharma Outlook',
      url: 'https://example.com/kirin-health-science',
      publishedAt: '2026-04-07',
      snippet: "Kirin's health science and pharmaceutical operations grew 28% year-over-year, demonstrating successful diversification beyond traditional beverage manufacturing.",
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-kirin-g4',
      title: 'Climate Change Threatens Beer Supply Chain Sustainability',
      source: 'Reuters',
      url: 'https://example.com/climate-beer-supply',
      publishedAt: '2026-04-03',
      snippet: 'Barley and hop crop disruptions due to climate volatility pose supply chain risks for major breweries including Kirin, affecting production costs and availability.',
      region: 'global',
      sentiment: 'mixed'
    },
    // Japan articles
    {
      id: 'mock-kirin-j1',
      title: 'キリン、健康飲料市場で新製品シリーズを展開',
      source: '日本経済新聞',
      url: 'https://example.com/kirin-health-drinks',
      publishedAt: '2026-04-13',
      snippet: 'キリンが健康機能を訴求した新飲料シリーズを全国展開。腸内環境や免疫力向上などの機能性で若年層の獲得を目指す。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kirin-j2',
      title: 'ビール市場の衰退加速、大手メーカーの利益圧縮続く',
      source: '朝日新聞',
      url: 'https://example.com/beer-market-decline',
      publishedAt: '2026-04-11',
      snippet: 'キリンを含むビール大手の2026年上半期売上が過去最低レベルに。消費者のアルコール離れが加速している。',
      region: 'japan',
      sentiment: 'negative'
    },
    {
      id: 'mock-kirin-j3',
      title: 'キリン、ライオンビール買収後のシナジー効果が顕在化',
      source: '東洋経済',
      url: 'https://example.com/kirin-lion-synergy',
      publishedAt: '2026-04-08',
      snippet: 'キリンが買収したオーストラリア大手ビール企業ライオンとの経営統合がコスト削減と事業多角化を実現。アジア太平洋事業の強化へ。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-kirin-j4',
      title: 'サステナビリティ対応で醸造業界の競争が激化',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/brewery-sustainability',
      publishedAt: '2026-04-04',
      snippet: 'キリンなど大手醸造メーカーが水資源管理とカーボンニュートラル達成に向けた投資競争を加速。規制強化への先制対応。',
      region: 'japan',
      sentiment: 'neutral'
    }
  ],
  nintendo: [
    // Global articles
    {
      id: 'mock-nintendo-g1',
      title: "Nintendo's Switch 2 Launch Exceeds Analyst Expectations with Record Pre-Orders",
      source: 'Game Informer',
      url: 'https://example.com/nintendo-switch2-launch',
      publishedAt: '2026-04-14',
      snippet: 'Nintendo announced record-breaking pre-order numbers for Switch 2, signaling strong consumer demand ahead of Q2 launch. Hardware analysts revise forecasts upward.',
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-nintendo-g2',
      title: 'AI-Generated Game Content Threatens Gaming IP Moats',
      source: 'TechCrunch',
      url: 'https://example.com/ai-game-content-threat',
      publishedAt: '2026-04-09',
      snippet: 'Generative AI capabilities for game asset creation pose existential questions for IP-dependent studios like Nintendo, challenging traditional licensing value propositions.',
      region: 'global',
      sentiment: 'mixed'
    },
    {
      id: 'mock-nintendo-g3',
      title: 'Nintendo Theme Park Expansion Drives Record Licensing Revenue',
      source: 'Forbes',
      url: 'https://example.com/nintendo-theme-park',
      publishedAt: '2026-04-06',
      snippet: "Nintendo's expanded Super Nintendo World attractions across multiple locations generated $1.2B in IP licensing and tourism revenue, diversifying revenue beyond gaming hardware.",
      region: 'global',
      sentiment: 'positive'
    },
    {
      id: 'mock-nintendo-g4',
      title: 'Mobile Gaming Competition Intensifies as Nintendo Shifts Strategy',
      source: 'Polygon',
      url: 'https://example.com/nintendo-mobile-competition',
      publishedAt: '2026-04-02',
      snippet: 'Nintendo faces increasing pressure from free-to-play mobile games despite efforts to expand its live-service offerings, struggling to engage Gen Z outside console gaming.',
      region: 'global',
      sentiment: 'negative'
    },
    // Japan articles
    {
      id: 'mock-nintendo-j1',
      title: '任天堂、映画化事業の拡大でハリウッドスタジオと提携強化',
      source: '日本経済新聞',
      url: 'https://example.com/nintendo-film-partnership',
      publishedAt: '2026-04-13',
      snippet: '任天堂がマリオやゼルダなどの主力IP映画化で複数のハリウッドスタジオとの提携を発表。ライセンス収入の大幅増加を見込む。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-nintendo-j2',
      title: 'ゲーム市場のコンソール離れが鮮明、モバイルシフト加速',
      source: '朝日新聞',
      url: 'https://example.com/console-mobile-shift',
      publishedAt: '2026-04-11',
      snippet: '任天堂の国内コンソール販売が微減する一方、スマートフォンゲーム市場は前年度比18%増。若年層のゲーム環境の大きな変化。',
      region: 'japan',
      sentiment: 'mixed'
    },
    {
      id: 'mock-nintendo-j3',
      title: '任天堂、Z世代向けeスポーツ戦略で新組織設立',
      source: '東洋経済',
      url: 'https://example.com/nintendo-esports-z-gen',
      publishedAt: '2026-04-08',
      snippet: '任天堂がZ世代ゲーマーのエンゲージメント向上を目指し、eスポーツ事業専門組織を設立。競技タイトルの開発投資を加速。',
      region: 'japan',
      sentiment: 'positive'
    },
    {
      id: 'mock-nintendo-j4',
      title: 'ゲーム業界でクリエイター権利保護の議論が活発化',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/game-creator-rights',
      publishedAt: '2026-04-05',
      snippet: 'インディーゲームクリエイターの権利保護について業界での議論が活発化。任天堂などプラットフォーム企業の対応が注目される。',
      region: 'japan',
      sentiment: 'neutral'
    }
  ]
}
