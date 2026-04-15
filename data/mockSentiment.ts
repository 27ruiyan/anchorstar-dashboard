import { SentimentResult } from '@/types/sentiment'

export const mockSentiment: Record<string, SentimentResult> = {
  kodansha: {
    globalSummary:
      'International coverage reflects cautious optimism about Kodansha\'s manga licensing expansion, with growing concerns about AI-generated content and intellectual property risks. Publishers and industry analysts emphasize both opportunity and vulnerability in the digital marketplace.',
    japanSummary:
      'Japanese media maintains a balanced perspective on the company\'s growth strategy, with particular focus on AI content risks and regulatory challenges. Coverage highlights the tension between expansion opportunities and the need to protect traditional creative industries.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['Licensing expansion', 'AI content risks', 'Digital marketplace'],
    japanThemes: ['IP protection', 'AI regulation', 'Creative industry growth'],
    articleSentiments: {
      'mock-kodansha-g1': 'positive',
      'mock-kodansha-g2': 'mixed',
      'mock-kodansha-g3': 'negative',
      'mock-kodansha-g4': 'mixed',
      'mock-kodansha-j1': 'mixed',
      'mock-kodansha-j2': 'neutral',
      'mock-kodansha-j3': 'negative',
      'mock-kodansha-j4': 'mixed',
    },
  },

  persol: {
    globalSummary:
      'Global press coverage focuses on PERSOL\'s AI-powered recruitment solutions as a response to persistent labor shortages, with mixed reactions from the tech and HR communities. Coverage balances innovation enthusiasm against employment displacement concerns.',
    japanSummary:
      'Japanese outlets emphasize the acute labor crisis in the domestic market and PERSOL\'s role in technological solutions, while showing more skepticism about job market impacts. Coverage reflects broader societal concerns about automation\'s effect on employment stability.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['AI recruitment', 'Labor shortage response', 'Tech innovation'],
    japanThemes: ['Employment impact', 'Labor market crisis', 'Automation concerns'],
    articleSentiments: {
      'mock-persol-g1': 'positive',
      'mock-persol-g2': 'mixed',
      'mock-persol-g3': 'mixed',
      'mock-persol-g4': 'neutral',
      'mock-persol-j1': 'neutral',
      'mock-persol-j2': 'mixed',
      'mock-persol-j3': 'negative',
      'mock-persol-j4': 'mixed',
    },
  },

  'ntt-east': {
    globalSummary:
      'International coverage highlights NTT East\'s strategic shift toward high-margin data center operations amid declining demand for traditional fixed-line services. Analysts note the company\'s adaptation to cloud computing trends as both a necessity and an opportunity.',
    japanSummary:
      'Japanese reporting reflects concern about legacy business decline while acknowledging data center growth as a strategic pivot. Coverage emphasizes the challenge of managing workforce and infrastructure transitions during this transformation period.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['Data center expansion', 'Fixed-line decline', 'Cloud infrastructure'],
    japanThemes: ['Business transformation', 'Legacy services decline', 'Infrastructure investment'],
    articleSentiments: {
      'mock-ntt-east-g1': 'mixed',
      'mock-ntt-east-g2': 'positive',
      'mock-ntt-east-g3': 'negative',
      'mock-ntt-east-g4': 'neutral',
      'mock-ntt-east-j1': 'mixed',
      'mock-ntt-east-j2': 'neutral',
      'mock-ntt-east-j3': 'mixed',
      'mock-ntt-east-j4': 'negative',
    },
  },

  kikkoman: {
    globalSummary:
      'Global media coverage is predominantly positive, focusing on Kikkoman\'s successful plant-based product lines and strong export growth momentum. International markets view the company as a well-positioned player in the health-conscious and sustainable food trend.',
    japanSummary:
      'Japanese coverage shows more nuanced sentiment, recognizing strong export success while maintaining skepticism about plant-based profitability. Domestic media emphasizes the balance between innovation and protection of core soy sauce heritage products.',
    globalSentiment: 'positive',
    japanSentiment: 'mixed',
    globalThemes: ['Plant-based expansion', 'Export growth', 'Health-conscious market'],
    japanThemes: ['Export success', 'Product innovation', 'Heritage protection'],
    articleSentiments: {
      'mock-kikkoman-g1': 'positive',
      'mock-kikkoman-g2': 'positive',
      'mock-kikkoman-g3': 'positive',
      'mock-kikkoman-g4': 'mixed',
      'mock-kikkoman-j1': 'mixed',
      'mock-kikkoman-j2': 'positive',
      'mock-kikkoman-j3': 'neutral',
      'mock-kikkoman-j4': 'mixed',
    },
  },

  kirin: {
    globalSummary:
      'International press coverage reflects Kirin\'s strategic pivot toward health science and non-alcoholic beverages as alcohol consumption declines globally. Investors and analysts view this diversification positively, though execution risks remain in emerging segments.',
    japanSummary:
      'Japanese media coverage is mixed, acknowledging the company\'s diversification efforts while expressing concerns about the declining alcoholic beverage market and domestic consumption trends. Coverage emphasizes the challenge of transforming a legacy alcohol company.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['Health science pivot', 'Alcohol decline', 'Beverage diversification'],
    japanThemes: ['Market transformation', 'Consumption decline', 'Portfolio diversification'],
    articleSentiments: {
      'mock-kirin-g1': 'positive',
      'mock-kirin-g2': 'mixed',
      'mock-kirin-g3': 'neutral',
      'mock-kirin-g4': 'mixed',
      'mock-kirin-j1': 'mixed',
      'mock-kirin-j2': 'negative',
      'mock-kirin-j3': 'neutral',
      'mock-kirin-j4': 'mixed',
    },
  },

  nintendo: {
    globalSummary:
      'Global media coverage is highly positive, driven by strong demand anticipation for Switch 2 and continued success across Nintendo\'s IP portfolio. International investors and gaming analysts express optimism about the company\'s innovation and brand loyalty.',
    japanSummary:
      'Japanese press coverage matches global enthusiasm, with particular focus on Nintendo\'s sustained innovation and cultural significance. Media emphasizes the company\'s role as a global brand ambassador and reliable growth engine in Japan\'s tech sector.',
    globalSentiment: 'positive',
    japanSentiment: 'positive',
    globalThemes: ['Switch 2 demand', 'IP success', 'Gaming innovation'],
    japanThemes: ['Innovation leadership', 'Global brand', 'Entertainment growth'],
    articleSentiments: {
      'mock-nintendo-g1': 'positive',
      'mock-nintendo-g2': 'positive',
      'mock-nintendo-g3': 'positive',
      'mock-nintendo-g4': 'positive',
      'mock-nintendo-j1': 'positive',
      'mock-nintendo-j2': 'positive',
      'mock-nintendo-j3': 'positive',
      'mock-nintendo-j4': 'positive',
    },
  },
}
