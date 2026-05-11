import { Language } from './tts.service';

type PageKey =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'ledger'
  | 'profile'
  | 'onboarding_welcome'
  | 'onboarding_profile'
  | 'onboarding_story'
  | 'onboarding_quiz'
  | 'onboarding_prioritizing'
  | 'onboarding_past_season'
  | 'onboarding_priority_intro'
  | 'onboarding_priority_items'
  | 'onboarding_ready';

type Translations = Record<PageKey, string>;

const content: Record<Language, Translations> = {
  en: {
    login:
      'Welcome to Koyta-Sathi. This app helps you track your advance and manage your budget. Please enter your 10-digit phone number and password to sign in.',
    signup:
      'Create your Koyta-Sathi account. Enter your full name, village, 10-digit phone number, and a password of at least 6 characters.',
    dashboard:
      'This is your dashboard. Here you can see your total advance borrowed, total amount repaid, and remaining balance. You can also view your priority plan and quick actions to go to the ledger or your profile.',
    ledger:
      'This is your ledger. It shows all your advance transactions. You can see how much advance you have taken and how much you have repaid. Tap the Add Entry button to record a new advance or repayment.',
    profile:
      'This is your profile page. You can update your name and village here. Your phone number is shown below your name. Tap Save Changes to update your information.',
    onboarding_welcome:
      'Welcome to Koyta-Sathi. This app is part of a research study by Harvard University and SOPPECOM to help sugarcane workers manage their advance and budget better. Your data will be kept safe and deleted by April 2027. Tap Let us Begin to start.',
    onboarding_profile:
      'Please tell us your name and village. This helps us personalise the app for you. Your phone number is already saved. Tap Continue when you are ready.',
    onboarding_story:
      'This is Geeta Tai\'s story. Geeta Tai is a sugarcane cutter from Maharashtra. She cannot read or write, but she knows how to plan for her family\'s future. She follows 6 steps to make a budget. First, set financial goals. Second, estimate your income. Third, decide how much to save. Fourth, list all expenses. Fifth, make sure expenses are not more than income. Sixth, follow the budget every month.',
    onboarding_quiz:
      'This is the budget quiz. Answer the questions to test your understanding of budgeting. Select the correct answer and tap Next Question to continue.',
    onboarding_prioritizing:
      'This is the prioritizing game. Look at each expense and decide if it is a Must Have right now, or if it can Wait for Later. Tap each item to change your choice.',
    onboarding_past_season:
      'Please enter your past season information. Tell us how much advance you took, how many days you worked, and how much arrears you have remaining. This helps us calculate your repayment capacity.',
    onboarding_priority_intro:
      'Now we will create your Priority Advance Plan. This plan helps you identify your most important expenses for the season. Research shows that households with a priority plan are 40 percent more likely to stay within their budget.',
    onboarding_priority_items:
      'Select the items that are most important for your family this season. You can change the amount for each item. The total will become your priority advance amount.',
    onboarding_ready:
      'You are ready to track your advances. From now on, every time you take an advance from the mukaddam, record it in the ledger. You can also record repayments. The app will show you how much of your planned advance you have used.',
  },

  hi: {
    login:
      'कोयता-साथी में आपका स्वागत है। यह ऐप आपको अपना अग्रिम ट्रैक करने और बजट प्रबंधित करने में मदद करता है। साइन इन करने के लिए अपना 10 अंकों का फोन नंबर और पासवर्ड दर्ज करें।',
    signup:
      'अपना कोयता-साथी खाता बनाएं। अपना पूरा नाम, गांव, 10 अंकों का फोन नंबर और कम से कम 6 अक्षरों का पासवर्ड दर्ज करें।',
    dashboard:
      'यह आपका डैशबोर्ड है। यहां आप देख सकते हैं कि आपने कुल कितना अग्रिम लिया है, कितना वापस किया है, और कितना बाकी है। आप अपनी प्राथमिकता योजना भी देख सकते हैं।',
    ledger:
      'यह आपका खाता बही है। इसमें आपके सभी अग्रिम लेनदेन दिखाई देते हैं। आप देख सकते हैं कि आपने कितना अग्रिम लिया और कितना वापस किया। नया अग्रिम या भुगतान दर्ज करने के लिए एंट्री जोड़ें बटन दबाएं।',
    profile:
      'यह आपका प्रोफाइल पेज है। आप यहां अपना नाम और गांव अपडेट कर सकते हैं। आपका फोन नंबर नीचे दिखाई देता है। जानकारी अपडेट करने के लिए परिवर्तन सहेजें दबाएं।',
    onboarding_welcome:
      'कोयता-साथी में आपका स्वागत है। यह ऐप हार्वर्ड विश्वविद्यालय और सोप्पेकॉम के एक शोध अध्ययन का हिस्सा है जो गन्ना मजदूरों को अपना अग्रिम और बजट बेहतर तरीके से प्रबंधित करने में मदद करता है। आपका डेटा सुरक्षित रखा जाएगा और अप्रैल 2027 तक हटा दिया जाएगा। शुरू करने के लिए चलिए शुरू करें दबाएं।',
    onboarding_profile:
      'कृपया अपना नाम और गांव बताएं। इससे हमें आपके लिए ऐप को व्यक्तिगत बनाने में मदद मिलती है। आपका फोन नंबर पहले से सहेजा गया है। तैयार होने पर जारी रखें दबाएं।',
    onboarding_story:
      'यह गीता ताई की कहानी है। गीता ताई महाराष्ट्र की एक गन्ना काटने वाली हैं। वे पढ़-लिख नहीं सकतीं, लेकिन वे अपने परिवार के भविष्य की योजना बनाना जानती हैं। वे बजट बनाने के लिए 6 कदम अपनाती हैं। पहला, वित्तीय लक्ष्य निर्धारित करें। दूसरा, आय का अनुमान लगाएं। तीसरा, बचत का निर्णय करें। चौथा, सभी खर्चों की सूची बनाएं। पांचवां, सुनिश्चित करें कि खर्च आय से अधिक न हो। छठा, हर महीने बजट का पालन करें।',
    onboarding_quiz:
      'यह बजट प्रश्नोत्तरी है। बजट की अपनी समझ का परीक्षण करने के लिए प्रश्नों के उत्तर दें। सही उत्तर चुनें और जारी रखने के लिए अगला प्रश्न दबाएं।',
    onboarding_prioritizing:
      'यह प्राथमिकता खेल है। प्रत्येक खर्च को देखें और तय करें कि यह अभी जरूरी है या बाद के लिए इंतजार कर सकता है। अपनी पसंद बदलने के लिए प्रत्येक आइटम पर टैप करें।',
    onboarding_past_season:
      'कृपया अपने पिछले सीजन की जानकारी दर्ज करें। बताएं कि आपने कितना अग्रिम लिया, कितने दिन काम किया, और कितना बकाया बचा है। इससे हमें आपकी चुकाने की क्षमता की गणना करने में मदद मिलती है।',
    onboarding_priority_intro:
      'अब हम आपकी प्राथमिकता अग्रिम योजना बनाएंगे। यह योजना आपको सीजन के लिए अपने सबसे महत्वपूर्ण खर्चों की पहचान करने में मदद करती है। शोध से पता चलता है कि प्राथमिकता योजना वाले परिवार 40 प्रतिशत अधिक संभावना के साथ अपने बजट के भीतर रहते हैं।',
    onboarding_priority_items:
      'इस सीजन में अपने परिवार के लिए सबसे महत्वपूर्ण आइटम चुनें। आप प्रत्येक आइटम की राशि बदल सकते हैं। कुल राशि आपकी प्राथमिकता अग्रिम राशि बन जाएगी।',
    onboarding_ready:
      'आप अपने अग्रिम को ट्रैक करने के लिए तैयार हैं। अब से, जब भी आप मुकादम से अग्रिम लें, उसे खाता बही में दर्ज करें। आप भुगतान भी दर्ज कर सकते हैं। ऐप आपको दिखाएगा कि आपने अपनी योजनाबद्ध अग्रिम राशि का कितना उपयोग किया है।',
  },

  'hi-en': {
    login:
      'Koyta-Sathi mein aapka swagat hai. Yeh app aapko apna advance track karne aur budget manage karne mein madad karta hai. Sign in karne ke liye apna 10 digit phone number aur password enter karein.',
    signup:
      'Apna Koyta-Sathi account banayein. Apna poora naam, gaon, 10 digit phone number aur kam se kam 6 characters ka password enter karein.',
    dashboard:
      'Yeh aapka dashboard hai. Yahan aap dekh sakte hain ki aapne total kitna advance liya hai, kitna wapas kiya hai, aur kitna baaki hai. Aap apna priority plan bhi dekh sakte hain.',
    ledger:
      'Yeh aapka ledger hai. Ismein aapke saare advance transactions dikhte hain. Aap dekh sakte hain ki aapne kitna advance liya aur kitna wapas kiya. Naya advance ya payment record karne ke liye Add Entry button dabayein.',
    profile:
      'Yeh aapka profile page hai. Aap yahan apna naam aur gaon update kar sakte hain. Aapka phone number neeche dikhta hai. Jaankari update karne ke liye Save Changes dabayein.',
    onboarding_welcome:
      'Koyta-Sathi mein aapka swagat hai. Yeh app Harvard University aur SOPPECOM ke ek research study ka hissa hai jo ganna mazdooron ko apna advance aur budget behtar tarike se manage karne mein madad karta hai. Aapka data safe rakha jayega aur April 2027 tak delete kar diya jayega. Shuru karne ke liye Chaliye Shuru Karein dabayein.',
    onboarding_profile:
      'Kripya apna naam aur gaon batayein. Isse humein aapke liye app ko personalise karne mein madad milti hai. Aapka phone number pehle se save hai. Taiyar hone par Continue dabayein.',
    onboarding_story:
      'Yeh Geeta Tai ki kahani hai. Geeta Tai Maharashtra ki ek ganna kaatne wali hain. Woh padh-likh nahi sakti, lekin woh apne parivaar ke bhavishya ki planning jaanti hain. Woh budget banane ke liye 6 steps follow karti hain. Pehla, financial goals set karein. Doosra, income ka estimate lagayein. Teesra, bachat ka faisla karein. Chautha, saare kharche ki list banayein. Paanchwa, ensure karein ki kharcha income se zyada na ho. Chhatha, har mahine budget follow karein.',
    onboarding_quiz:
      'Yeh budget quiz hai. Budgeting ki apni samajh test karne ke liye questions ke jawab dein. Sahi jawab chunein aur continue karne ke liye Next Question dabayein.',
    onboarding_prioritizing:
      'Yeh prioritizing game hai. Har kharche ko dekhein aur decide karein ki yeh abhi zaroori hai ya baad ke liye wait kar sakta hai. Apni choice badalne ke liye har item par tap karein.',
    onboarding_past_season:
      'Kripya apne pichhle season ki jaankari enter karein. Batayein ki aapne kitna advance liya, kitne din kaam kiya, aur kitna baaki bacha hai. Isse humein aapki repayment capacity calculate karne mein madad milti hai.',
    onboarding_priority_intro:
      'Ab hum aapka Priority Advance Plan banayenge. Yeh plan aapko season ke liye apne sabse important kharche identify karne mein madad karta hai. Research se pata chalta hai ki priority plan wale ghar 40 percent zyada sambhavna ke saath apne budget ke andar rehte hain.',
    onboarding_priority_items:
      'Is season mein apne parivaar ke liye sabse important items chunein. Aap har item ki amount badal sakte hain. Total amount aapki priority advance amount ban jayegi.',
    onboarding_ready:
      'Aap apne advances track karne ke liye taiyar hain. Ab se, jab bhi aap mukaddam se advance lein, use ledger mein record karein. Aap repayments bhi record kar sakte hain. App aapko dikhayega ki aapne apni planned advance amount ka kitna use kiya hai.',
  },

  mr: {
    login:
      'कोयता-साथीमध्ये आपले स्वागत आहे. हे अॅप तुम्हाला तुमची आगाऊ रक्कम ट्रॅक करण्यास आणि बजेट व्यवस्थापित करण्यास मदत करते. साइन इन करण्यासाठी तुमचा 10 अंकी फोन नंबर आणि पासवर्ड टाका.',
    signup:
      'तुमचे कोयता-साथी खाते तयार करा. तुमचे पूर्ण नाव, गाव, 10 अंकी फोन नंबर आणि किमान 6 अक्षरांचा पासवर्ड टाका.',
    dashboard:
      'हे तुमचे डॅशबोर्ड आहे. येथे तुम्ही पाहू शकता की तुम्ही एकूण किती आगाऊ रक्कम घेतली, किती परत केली आणि किती शिल्लक आहे. तुम्ही तुमची प्राधान्य योजना देखील पाहू शकता.',
    ledger:
      'हे तुमचे खातेवही आहे. यात तुमचे सर्व आगाऊ व्यवहार दिसतात. तुम्ही पाहू शकता की तुम्ही किती आगाऊ रक्कम घेतली आणि किती परत केली. नवीन आगाऊ किंवा परतफेड नोंदवण्यासाठी एंट्री जोडा बटण दाबा.',
    profile:
      'हे तुमचे प्रोफाइल पेज आहे. तुम्ही येथे तुमचे नाव आणि गाव अपडेट करू शकता. तुमचा फोन नंबर खाली दिसतो. माहिती अपडेट करण्यासाठी बदल जतन करा दाबा.',
    onboarding_welcome:
      'कोयता-साथीमध्ये आपले स्वागत आहे. हे अॅप हार्वर्ड विद्यापीठ आणि सोप्पेकॉमच्या संशोधन अभ्यासाचा भाग आहे जे ऊस कामगारांना त्यांची आगाऊ रक्कम आणि बजेट अधिक चांगल्या प्रकारे व्यवस्थापित करण्यास मदत करते. तुमचा डेटा सुरक्षित ठेवला जाईल आणि एप्रिल 2027 पर्यंत हटवला जाईल. सुरू करण्यासाठी चला सुरू करूया दाबा.',
    onboarding_profile:
      'कृपया तुमचे नाव आणि गाव सांगा. यामुळे आम्हाला तुमच्यासाठी अॅप वैयक्तिकृत करण्यास मदत होते. तुमचा फोन नंबर आधीच जतन केला आहे. तयार असताना सुरू ठेवा दाबा.',
    onboarding_story:
      'ही गीता ताईची कहाणी आहे. गीता ताई महाराष्ट्रातील एक ऊस कापणारी आहेत. त्या वाचू-लिहू शकत नाहीत, पण त्यांना त्यांच्या कुटुंबाच्या भविष्याची योजना करणे माहीत आहे. त्या बजेट बनवण्यासाठी 6 पायऱ्या वापरतात. पहिली, आर्थिक उद्दिष्टे ठरवा. दुसरी, उत्पन्नाचा अंदाज लावा. तिसरी, बचतीचा निर्णय घ्या. चौथी, सर्व खर्चांची यादी करा. पाचवी, खर्च उत्पन्नापेक्षा जास्त नसल्याची खात्री करा. सहावी, दर महिन्याला बजेटचे पालन करा.',
    onboarding_quiz:
      'हे बजेट प्रश्नमंजुषा आहे. बजेटिंगची तुमची समज तपासण्यासाठी प्रश्नांची उत्तरे द्या. योग्य उत्तर निवडा आणि सुरू ठेवण्यासाठी पुढील प्रश्न दाबा.',
    onboarding_prioritizing:
      'हे प्राधान्यक्रम खेळ आहे. प्रत्येक खर्च पाहा आणि ठरवा की हे आत्ता आवश्यक आहे किंवा नंतरसाठी थांबू शकते. तुमची निवड बदलण्यासाठी प्रत्येक आयटमवर टॅप करा.',
    onboarding_past_season:
      'कृपया तुमच्या मागील हंगामाची माहिती टाका. सांगा की तुम्ही किती आगाऊ रक्कम घेतली, किती दिवस काम केले आणि किती थकबाकी शिल्लक आहे. यामुळे आम्हाला तुमची परतफेड क्षमता मोजण्यास मदत होते.',
    onboarding_priority_intro:
      'आता आम्ही तुमची प्राधान्य आगाऊ योजना तयार करू. ही योजना तुम्हाला हंगामासाठी तुमचे सर्वात महत्त्वाचे खर्च ओळखण्यास मदत करते. संशोधनातून असे दिसून आले आहे की प्राधान्य योजना असलेली कुटुंबे 40 टक्के अधिक शक्यतेने त्यांच्या बजेटमध्ये राहतात.',
    onboarding_priority_items:
      'या हंगामात तुमच्या कुटुंबासाठी सर्वात महत्त्वाचे आयटम निवडा. तुम्ही प्रत्येक आयटमची रक्कम बदलू शकता. एकूण रक्कम तुमची प्राधान्य आगाऊ रक्कम बनेल.',
    onboarding_ready:
      'तुम्ही तुमच्या आगाऊ रकमा ट्रॅक करण्यासाठी तयार आहात. आतापासून, जेव्हाही तुम्ही मुकादमकडून आगाऊ रक्कम घ्याल, ती खातेवहीत नोंदवा. तुम्ही परतफेड देखील नोंदवू शकता. अॅप तुम्हाला दाखवेल की तुम्ही तुमच्या नियोजित आगाऊ रकमेचा किती वापर केला आहे.',
  },
};

export const getPageTTS = (page: PageKey, language: Language): string => {
  return content[language]?.[page] || content['en'][page] || '';
};

export type { PageKey };
