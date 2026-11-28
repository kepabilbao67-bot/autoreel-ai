import { NextResponse } from 'next/server'
import { requireApiUser } from '@/lib/api-auth'

// POST - Translate video script
export async function POST(request: Request) {
  const auth = await requireApiUser(request, 'ai')
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { script, targetLanguage, sourceLanguage } = body

    if (!script || !targetLanguage) {
      return NextResponse.json(
        { error: 'Se requiere script y targetLanguage' },
        { status: 400 }
      )
    }

    const openaiKey = process.env.OPENAI_API_KEY

    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a professional translator. Translate the following text from ${sourceLanguage || 'Spanish'} to ${targetLanguage}. Keep the tone and style appropriate for social media video scripts. Return only the translation.`,
              },
              {
                role: 'user',
                content: script,
              },
            ],
            temperature: 0.3,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const translation = data.choices?.[0]?.message?.content || ''
          return NextResponse.json({
            success: true,
            provider: 'openai',
            originalScript: script,
            translatedScript: translation,
            targetLanguage,
          })
        }
      } catch (err) {
        console.error('OpenAI API error, falling back to mock:', err)
      }
    }

    // Mock translation
    const mockTranslations: Record<string, string> = {
      en: `[English Translation]\n\n${script.split(' ').slice(0, 5).join(' ')}... (translated to English)\n\nThis is a mock translation of your script. Connect your OpenAI API key for real translations.`,
      pt: `[Traducao em Portugues]\n\n${script.split(' ').slice(0, 5).join(' ')}... (traduzido para portugues)\n\nEsta e uma traducao simulada do seu roteiro. Conecte sua chave OpenAI para traducoes reais.`,
      fr: `[Traduction en Francais]\n\n${script.split(' ').slice(0, 5).join(' ')}... (traduit en francais)\n\nCeci est une traduction simulee de votre script. Connectez votre cle OpenAI pour de vraies traductions.`,
      de: `[Deutsche Ubersetzung]\n\n${script.split(' ').slice(0, 5).join(' ')}... (auf Deutsch ubersetzt)\n\nDies ist eine simulierte Ubersetzung Ihres Skripts. Verbinden Sie Ihren OpenAI-Schlussel fur echte Ubersetzungen.`,
      it: `[Traduzione in Italiano]\n\n${script.split(' ').slice(0, 5).join(' ')}... (tradotto in italiano)\n\nQuesta e una traduzione simulata del tuo script. Collega la tua chiave OpenAI per traduzioni reali.`,
      ja: `[日本語翻訳]\n\n${script.split(' ').slice(0, 5).join(' ')}... (日本語に翻訳)\n\nこれはスクリプトのモック翻訳です。実際の翻訳にはOpenAI APIキーを接続してください。`,
      ko: `[한국어 번역]\n\n${script.split(' ').slice(0, 5).join(' ')}... (한국어로 번역됨)\n\n이것은 스크립트의 모의 번역입니다. 실제 번역을 위해 OpenAI API 키를 연결하세요.`,
      zh: `[中文翻译]\n\n${script.split(' ').slice(0, 5).join(' ')}... (翻译成中文)\n\n这是您脚本的模拟翻译。连接您的OpenAI API密钥以获取真实翻译。`,
      ar: `[ترجمة عربية]\n\n${script.split(' ').slice(0, 5).join(' ')}... (مترجم إلى العربية)\n\nهذه ترجمة تجريبية لنصك. قم بتوصيل مفتاح OpenAI للترجمات الحقيقية.`,
      hi: `[हिंदी अनुवाद]\n\n${script.split(' ').slice(0, 5).join(' ')}... (हिंदी में अनुवादित)\n\nयह आपकी स्क्रिप्ट का मॉक अनुवाद है। वास्तविक अनुवाद के लिए अपनी OpenAI API कुंजी कनेक्ट करें।`,
      ru: `[Перевод на русский]\n\n${script.split(' ').slice(0, 5).join(' ')}... (переведено на русский)\n\nЭто пробный перевод вашего сценария. Подключите ключ OpenAI для реальных переводов.`,
      nl: `[Nederlandse vertaling]\n\n${script.split(' ').slice(0, 5).join(' ')}... (vertaald naar het Nederlands)\n\nDit is een simulatie vertaling van uw script. Sluit uw OpenAI-sleutel aan voor echte vertalingen.`,
      pl: `[Tlumaczenie na polski]\n\n${script.split(' ').slice(0, 5).join(' ')}... (przetlumaczono na polski)\n\nTo jest symulowane tlumaczenie Twojego skryptu. Podlacz klucz OpenAI dla prawdziwych tlumaczen.`,
      tr: `[Turkce Ceviri]\n\n${script.split(' ').slice(0, 5).join(' ')}... (Turkceye cevrildi)\n\nBu, betiginizin simule edilmis bir cevirisidir. Gercek ceviriler icin OpenAI anahtarinizi baglayin.`,
      sv: `[Svensk oversattning]\n\n${script.split(' ').slice(0, 5).join(' ')}... (oversatt till svenska)\n\nDetta ar en simulerad oversattning av ditt manus. Anslut din OpenAI-nyckel for riktiga oversattningar.`,
    }

    const langCode = targetLanguage.toLowerCase().split('-')[0]
    const translated = mockTranslations[langCode] ||
      `[Traduccion a ${targetLanguage}]\n\n${script}\n\n(Traduccion simulada - conecta tu API key de OpenAI para traducciones reales)`

    return NextResponse.json({
      success: true,
      provider: 'mock',
      originalScript: script,
      translatedScript: translated,
      targetLanguage,
      message: 'Traduccion generada en modo demo',
    })
  } catch (error) {
    console.error('Error en traduccion:', error)
    return NextResponse.json(
      { error: 'Error traduciendo script' },
      { status: 500 }
    )
  }
}
