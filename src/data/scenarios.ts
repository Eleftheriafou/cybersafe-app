import type { Scenario, RoleId } from '@/types';

export const SCENARIOS: Scenario[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // 1. Phishing email — spoofed IT domain
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'phish-001',
    title: 'Your Account Will Be Locked',
    description:
      'You receive an email saying your work account will be suspended in 24 hours due to "unusual sign-in activity." It looks like every other IT message you have seen — company logo, correct colours, professional tone. There is a large blue button that says "Verify My Account Now."',
    context: [
      'FROM: IT Support <helpdesk@acme-corp-support.com>',
      'TO: you@acme-corp.com',
      'SUBJECT: ⚠️ Action Required: Verify your account within 24 hours',
      '---',
      'Your account has been flagged for unusual sign-in activity.',
      'Please verify your identity within 24 hours to avoid suspension.',
      '',
      '👉 [Verify My Account Now]',
      '',
      '⚠ NOTE: Your company domain is acme-corp.com.',
      'This email came from acme-corp-support.com.',
    ].join('\n'),
    contextType: 'email',
    category: 'phishing',
    difficulty: 'easy',
    lesson:
      'Always check the sender\'s full email address — not just the display name. Attackers register look-alike domains (acme-corp-support.com instead of acme-corp.com) specifically to fool you. When in doubt, go directly to the IT helpdesk portal by typing the address yourself.',
    choices: [
      {
        id: 'phish-001-a',
        text: 'Click "Verify My Account Now" — you can\'t afford to lose access to your work account.',
        isCorrect: false,
        feedback:
          'The sender domain "acme-corp-support.com" doesn\'t match your real company domain "acme-corp.com". This is a phishing site designed to steal your password the moment you type it in.',
        scoreImpact: -25,
      },
      {
        id: 'phish-001-b',
        text: 'Reply to the email asking if it is genuine.',
        isCorrect: false,
        feedback:
          'Replying confirms to the attacker that your email address is active and goes straight back to them. Never engage with a suspicious email — report it.',
        scoreImpact: -10,
      },
      {
        id: 'phish-001-c',
        text: 'Check the sender\'s full email address, notice the domain looks wrong, and report it to IT without clicking anything.',
        isCorrect: true,
        feedback:
          'Exactly right. Spotting the mismatched domain and reporting it — without clicking — is the textbook response. Your report also helps IT block the same attack for your colleagues.',
        scoreImpact: 25,
      },
      {
        id: 'phish-001-d',
        text: 'Forward the email to a colleague and ask what they think.',
        isCorrect: false,
        feedback:
          'Forwarding spreads the threat and puts your colleague at risk. Report suspicious emails to IT directly — don\'t circulate them.',
        scoreImpact: -5,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Suspicious attachment — .exe disguised as invoice
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'attach-001',
    title: 'The Invoice That Isn\'t',
    description:
      'You were expecting an invoice from one of your regular suppliers this week. An email arrives from them with an attached file. Something feels slightly off but you can\'t quite put your finger on it.',
    context: [
      'FROM: Accounts <billing@globaltech-supplies.com>',
      'TO: you@acme-corp.com',
      'SUBJECT: Invoice #4821 — March Services',
      '---',
      'Hi,',
      '',
      'Please find attached your invoice for March.',
      'Payment is due within 14 days.',
      '',
      'Best regards,',
      'GlobalTech Supplies',
      '',
      '📎 Invoice_March_FINAL.exe',
      '',
      '⚠ NOTE: Legitimate invoices are PDF or Word files — never .exe',
    ].join('\n'),
    contextType: 'email',
    category: 'phishing',
    difficulty: 'easy',
    lesson:
      'Legitimate invoices are always PDF or Word documents — never .exe, .zip, or .js files. An .exe is a program that runs code on your computer the moment you open it. When a file extension doesn\'t match what you expected, stop and verify by phone before doing anything.',
    choices: [
      {
        id: 'attach-001-a',
        text: 'Open the attachment — you were expecting an invoice and you recognise the supplier name.',
        isCorrect: false,
        feedback:
          'The file is an .exe — a runnable program, not a document. Opening it could silently install malware or ransomware, regardless of how familiar the sender looks.',
        scoreImpact: -30,
      },
      {
        id: 'attach-001-b',
        text: 'Save it to your Desktop and run an antivirus scan on it first.',
        isCorrect: false,
        feedback:
          'Saving the file is still risky, and antivirus doesn\'t catch everything. The safest move is to not interact with the file at all and verify with the supplier by phone.',
        scoreImpact: -10,
      },
      {
        id: 'attach-001-c',
        text: 'Do not open the file. Call the supplier using a phone number from your own records to ask if they sent it.',
        isCorrect: true,
        feedback:
          'Perfect. Calling on a number you already have — not one from the email — confirms whether the message is genuine. If the supplier didn\'t send it, report the email to IT immediately.',
        scoreImpact: 25,
      },
      {
        id: 'attach-001-d',
        text: 'Reply to the email asking the supplier to resend it as a PDF.',
        isCorrect: false,
        feedback:
          'If this is a phishing email, replying confirms your address is active. Always verify through a separate channel — a phone call — not the same email thread.',
        scoreImpact: -10,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. CEO fraud / Business Email Compromise
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'bec-001',
    title: 'Urgent Request from the CEO',
    description:
      'It\'s Friday afternoon. You receive an email from your CEO, Helen Crawford, asking you to urgently transfer £14,500 to a new supplier before the end of the day. She says she\'s in back-to-back meetings and cannot be disturbed, and the deal must stay confidential.',
    context: [
      'FROM: Helen Crawford <h.crawford@acme-corp.co>',
      'TO: you@acme-corp.com',
      'SUBJECT: Confidential — urgent payment needed today',
      '---',
      'Hi,',
      '',
      'I need a £14,500 payment processed today — new supplier.',
      'Please bypass the normal approval system, this is confidential.',
      'Bank: First National | Sort: 40-12-34 | Acc: 12345678',
      '',
      'Do NOT discuss this with anyone. I\'m in meetings all day.',
      '— Helen',
      '',
      '⚠ NOTE: Helen\'s real address is h.crawford@acme-corp.com',
      'This came from acme-corp.co — a different domain.',
    ].join('\n'),
    contextType: 'email',
    category: 'social-engineering',
    difficulty: 'medium',
    lesson:
      'Business Email Compromise (BEC) is one of the costliest cybercrimes. Attackers register near-identical domains and impersonate executives to pressure staff into skipping approval steps. No legitimate payment ever bypasses your company\'s financial controls — urgency and secrecy are always red flags.',
    choices: [
      {
        id: 'bec-001-a',
        text: 'Process the transfer — the CEO asked urgently and you don\'t want to let her down.',
        isCorrect: false,
        feedback:
          'The sender domain is ".co" not ".com". This is a Business Email Compromise attack. Once funds reach a fraudulent account, recovery is nearly impossible.',
        scoreImpact: -30,
      },
      {
        id: 'bec-001-b',
        text: 'Reply to the email to confirm the bank details before sending.',
        isCorrect: false,
        feedback:
          'Replying continues the conversation with the attacker. They\'ll confirm the fake details and push you harder. Always verify through a completely separate channel.',
        scoreImpact: -15,
      },
      {
        id: 'bec-001-c',
        text: 'Call Helen directly on her known office or mobile number to verify the request.',
        isCorrect: true,
        feedback:
          'Correct. A 30-second phone call on a number from the company directory confirms whether the request is real. Legitimate executives always understand why financial verification calls are necessary.',
        scoreImpact: 25,
      },
      {
        id: 'bec-001-d',
        text: 'Process half the amount now and wait for further confirmation before sending the rest.',
        isCorrect: false,
        feedback:
          'Sending any amount to a fraudulent account is a loss. Partial compliance still makes you a successful target. Always verify first — send nothing.',
        scoreImpact: -20,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Fake login page
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'fake-login-001',
    title: 'Sign In to Continue',
    description:
      'While working, a new browser tab opens on its own with a page that looks exactly like the Microsoft 365 sign-in screen. It says your session has expired. You need to access a file for a meeting in 10 minutes.',
    context: [
      'ADDRESS BAR:',
      'https://microsoft365-login.helpdesk-portal.net/signin',
      '---',
      'PAGE: Microsoft 365 — Sign in',
      '  [  your.name@acme-corp.com  ]',
      '  [  ••••••••  ]',
      '  [ Sign in ]',
      '',
      '⚠ NOTE: Microsoft\'s real sign-in is:',
      'https://login.microsoftonline.com',
    ].join('\n'),
    contextType: 'browser',
    category: 'phishing',
    difficulty: 'easy',
    lesson:
      'Always check the URL in the address bar before entering a password — especially when a login page appears unexpectedly. Microsoft, Google, and your bank will always be on their own domains. Any other domain is a fake, no matter how convincing the page looks.',
    choices: [
      {
        id: 'fake-login-001-a',
        text: 'Enter your credentials quickly — you have a meeting soon and can\'t lose access.',
        isCorrect: false,
        feedback:
          'The domain "helpdesk-portal.net" has nothing to do with Microsoft. Entering your credentials here hands your username and password directly to an attacker.',
        scoreImpact: -30,
      },
      {
        id: 'fake-login-001-b',
        text: 'Close the tab and open Microsoft 365 by typing the address yourself into a new tab.',
        isCorrect: true,
        feedback:
          'Exactly right. Closing the suspicious tab and typing the real address ensures you only enter credentials on the legitimate service.',
        scoreImpact: 25,
      },
      {
        id: 'fake-login-001-c',
        text: 'Click "Cancel" on the login screen and see if it goes away.',
        isCorrect: false,
        feedback:
          'Interacting with any element on the page — even Cancel — can trigger a script. Close the entire tab immediately without clicking anything inside it.',
        scoreImpact: -10,
      },
      {
        id: 'fake-login-001-d',
        text: 'Enter your email address but not your password to see what happens next.',
        isCorrect: false,
        feedback:
          'Even your email address alone confirms your account exists and helps attackers target you further. Don\'t interact with the page at all.',
        scoreImpact: -15,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 5. Smishing — fake delivery text
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'smish-001',
    title: 'Your Parcel Is on Hold',
    description:
      'You receive a text message on your mobile. You have been waiting on a delivery from an online order placed earlier this week, so the timing seems about right.',
    context: [
      'SENDER: Royal Mail',
      '---',
      'Your parcel (ref: GB193882) could not be',
      'delivered due to an incomplete address.',
      '',
      'A £2.99 redelivery fee is required to',
      'release your package. Pay now:',
      '',
      'royalmail-redelivery-uk.com/pay',
      '',
      '⚠ NOTE: Royal Mail\'s real site is royalmail.com',
    ].join('\n'),
    contextType: 'sms',
    category: 'phishing',
    difficulty: 'easy',
    lesson:
      'Delivery smishing scams catch you off guard when you are expecting a parcel. The small fee seems harmless, but the real goal is to steal your card details. Royal Mail and other couriers never ask you to pay a fee via a text message link. Always go to the official website directly.',
    choices: [
      {
        id: 'smish-001-a',
        text: 'Click the link and pay £2.99 — it\'s a small amount and you need the parcel.',
        isCorrect: false,
        feedback:
          'The link goes to "royalmail-redelivery-uk.com" — not "royalmail.com". Entering your card details here hands them to scammers who will then make much larger purchases.',
        scoreImpact: -25,
      },
      {
        id: 'smish-001-b',
        text: 'Forward the text to your partner who placed the order to let them decide.',
        isCorrect: false,
        feedback:
          'Forwarding a smishing link puts someone else at risk too. Delete the message and alert your partner separately if needed.',
        scoreImpact: -10,
      },
      {
        id: 'smish-001-c',
        text: 'Call the number in the text to check whether it\'s real.',
        isCorrect: false,
        feedback:
          'The number in a smishing message connects directly to the scammers. Never call back numbers provided in suspicious texts.',
        scoreImpact: -15,
      },
      {
        id: 'smish-001-d',
        text: 'Ignore the text and check your delivery status by typing the courier\'s official address into a browser yourself.',
        isCorrect: true,
        feedback:
          'Correct. Typing the official website address yourself is the only safe way to check. Any real delivery issue will show up on your account there.',
        scoreImpact: 25,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 6. QR phishing (quishing)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'qr-001',
    title: 'The Survey in the Kitchen',
    description:
      'A printed poster has appeared on the kitchen wall. It has the company logo, a friendly message from "The HR Team," and a large QR code. It wasn\'t there yesterday. You haven\'t received any company email about a staff survey.',
    context: [
      '┌─────────────────────────────────┐',
      '│    🏢  ACME CORP  🏢           │',
      '│                                 │',
      '│   Staff Satisfaction Survey     │',
      '│                                 │',
      '│   ┌───────────────────────┐    │',
      '│   │ ▓▓ ░░░ ▓▓░ ▓▓░░░▓▓  │    │',
      '│   │ ░░ ▓▓░ ░▓░ ░▓░▓▓░░  │    │',
      '│   │ ▓░▓ ░░▓ ▓░▓ ░░░ ▓▓  │    │',
      '│   └───────────────────────┘    │',
      '│                                 │',
      '│   Scan to take part! — HR Team │',
      '└─────────────────────────────────┘',
      '',
      '⚠ NOTE: No survey email was sent by HR.',
      'Anyone with a printer could post this.',
    ].join('\n'),
    contextType: 'poster',
    category: 'phishing',
    difficulty: 'medium',
    lesson:
      'QR code phishing ("quishing") is a growing attack because you can\'t read a QR code with your eyes before scanning it. Attackers print convincing fake posters in offices, cafés, and car parks. If you didn\'t expect it, verify it with the supposed sender before scanning.',
    choices: [
      {
        id: 'qr-001-a',
        text: 'Scan it — surveys are common and the poster uses the company logo.',
        isCorrect: false,
        feedback:
          'Scanning an unverified QR code could take you to a phishing site or silently download malware. Looking official means nothing — anyone can print a convincing poster.',
        scoreImpact: -20,
      },
      {
        id: 'qr-001-b',
        text: 'Scan it on your personal phone rather than your work phone to protect work devices.',
        isCorrect: false,
        feedback:
          'Your personal phone is just as vulnerable to credential theft and malware. Using it doesn\'t make the action safe — it just shifts the risk.',
        scoreImpact: -15,
      },
      {
        id: 'qr-001-c',
        text: 'Contact HR directly to ask whether they posted a survey, before scanning anything.',
        isCorrect: true,
        feedback:
          'Exactly right. A quick message to HR takes 30 seconds and confirms whether the poster is real. If they didn\'t post it, you\'ve just discovered a physical security incident worth reporting.',
        scoreImpact: 25,
      },
      {
        id: 'qr-001-d',
        text: 'Take a photo and post it in the team chat to ask colleagues.',
        isCorrect: false,
        feedback:
          'Sharing the photo may prompt colleagues to scan it before you\'ve verified it. Go to the source — check with HR first.',
        scoreImpact: -10,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 7. Vishing — fake IT support call
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'vish-001',
    title: 'IT Called About Your Account',
    description:
      'Your desk phone rings. The caller says they are from the IT helpdesk and have detected suspicious login attempts on your account from an overseas IP address. They need you to install a "security patch" by visiting a web address they\'ll read out. They are polite, sound knowledgeable, and know your full name and job title.',
    context: [
      'INCOMING CALL',
      '📞  Unknown Number',
      '─────────────────────',
      '"Hi, this is James from IT Support.',
      ' We\'ve detected suspicious activity',
      ' on your account from Russia.',
      '',
      ' I need you to visit a URL I\'ll give',
      ' you and install our security tool.',
      ' This is urgent — can you do it now?"',
      '',
      '⚠ NOTE: Your IT helpdesk number is on',
      'the intranet. This is not that number.',
      'Your name is public on the company website.',
    ].join('\n'),
    contextType: 'phone',
    category: 'social-engineering',
    difficulty: 'medium',
    lesson:
      'IT support will never cold-call you and ask you to install software or visit a URL they provide. Knowing your name is easy — it\'s public information. Hang up without guilt and call IT back using the official number from the company intranet. Legitimate IT staff will always support this response.',
    choices: [
      {
        id: 'vish-001-a',
        text: 'Follow the instructions — IT sometimes calls about security issues and the caller sounds genuine.',
        isCorrect: false,
        feedback:
          'Installing software at a caller\'s request is one of the most common ways attackers gain full remote access to a machine. Knowing your name is not proof of identity.',
        scoreImpact: -30,
      },
      {
        id: 'vish-001-b',
        text: 'Give them your employee ID number so they can verify who you are first.',
        isCorrect: false,
        feedback:
          'Your employee ID helps an attacker impersonate you in future attacks. Never share personal or work identifiers with an unverified caller.',
        scoreImpact: -15,
      },
      {
        id: 'vish-001-c',
        text: 'Tell them you\'ll call IT back on the official number from the intranet, then hang up.',
        isCorrect: true,
        feedback:
          'Perfect. Hanging up and calling back on the official number is the gold standard for unexpected IT calls. If the alert was real, IT will confirm it. If not, you\'ve avoided a serious incident.',
        scoreImpact: 25,
      },
      {
        id: 'vish-001-d',
        text: 'Ask them to send you an email with the instructions instead.',
        isCorrect: false,
        feedback:
          'An attacker can send a convincing follow-up email just as easily as making a phone call. This doesn\'t verify their identity — it shifts the attack to a different channel.',
        scoreImpact: -10,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 8. Invoice / payment redirect fraud
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'invoice-001',
    title: 'Our Bank Details Have Changed',
    description:
      'You receive an email from a supplier your company has paid reliably for two years. They say they have recently switched banks and all future invoices should be paid to their new account.',
    context: [
      'FROM: Accounts <billing@globaltech-supplies.co>',
      'TO: finance@acme-corp.com',
      'SUBJECT: Important: Updated bank account details',
      '---',
      'Hi Finance Team,',
      '',
      'We\'ve changed our banking provider.',
      'Please update our payment details:',
      '',
      '  Bank:    Metro Business Bank',
      '  Sort:    20-45-67',
      '  Account: 87654321',
      '',
      'This applies from Invoice #5103 onwards.',
      '',
      '⚠ NOTE: Supplier\'s real domain: globaltech-supplies.com',
      'This email came from: globaltech-supplies.co',
    ].join('\n'),
    contextType: 'email',
    category: 'social-engineering',
    difficulty: 'hard',
    lesson:
      'Payment redirect fraud costs businesses millions every year. Attackers monitor email conversations and time these requests to coincide with real invoice cycles. The rule is simple: any request to change payment details must be verified by calling your contact using a phone number from your own records — never one from the email.',
    choices: [
      {
        id: 'invoice-001-a',
        text: 'Update the bank details and schedule the next payment to the new account.',
        isCorrect: false,
        feedback:
          'The sender domain is ".co" not ".com". Attackers include real invoice references to build credibility. Once money reaches a fraudulent account it is extremely difficult to recover.',
        scoreImpact: -30,
      },
      {
        id: 'invoice-001-b',
        text: 'Reply to the email to confirm the new account details are correct.',
        isCorrect: false,
        feedback:
          'Replying confirms the details back to the attacker, who will say "yes, correct." Always use a completely separate channel — a phone call — to verify financial changes.',
        scoreImpact: -20,
      },
      {
        id: 'invoice-001-c',
        text: 'Call your contact at the supplier using the phone number saved in your own records — not anything from this email.',
        isCorrect: true,
        feedback:
          'Exactly right. A phone call on a number you already hold is the only way to verify a bank change request safely. If the supplier confirms it, then update the details.',
        scoreImpact: 30,
      },
      {
        id: 'invoice-001-d',
        text: 'Pass it to a colleague in finance to handle — you don\'t want the responsibility.',
        isCorrect: false,
        feedback:
          'Passing it on without flagging your suspicion means a colleague may process the fraudulent payment without the context you noticed. Always raise the red flag when escalating.',
        scoreImpact: -10,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 9. Social engineering — LinkedIn job scam / pretexting
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'social-002',
    title: 'A Very Flattering Job Offer',
    description:
      'A recruiter named "Jessica Moore" messages you on LinkedIn. She says a top firm is very interested in your profile and the package would be a significant step up. To move forward she asks you to complete a short screening form.',
    context: [
      'LINKEDIN MESSAGE',
      '👤 Jessica Moore · Recruiter at TalentBridge',
      '   Profile created 3 weeks ago · 14 connections',
      '─────────────────────────────────────────',
      '"Hi! Your profile caught our client\'s eye.',
      ' They\'re offering a great package.',
      '',
      ' Please complete this quick screening form',
      ' to move forward: forms.google.com/d/abc123',
      '',
      ' It asks for: name, employer, work email,',
      ' and a background check authorisation code',
      ' (we\'ll send it to your work inbox)."',
      '',
      '⚠ NOTE: Real recruiters use company domains,',
      'not Google Forms. "Auth codes" are a red flag.',
    ].join('\n'),
    contextType: 'social',
    category: 'social-engineering',
    difficulty: 'medium',
    lesson:
      'Job offer scams on LinkedIn harvest corporate email credentials and internal information. Requesting a "screening code" sent to your work email is a technique to verify and potentially hijack your work account. Genuine recruiters always work from a verifiable company domain and never ask for codes or passwords.',
    choices: [
      {
        id: 'social-002-a',
        text: 'Fill in the form — it\'s exciting and you\'re only sharing basic information.',
        isCorrect: false,
        feedback:
          'The combination of your work email and a "verification code" is a credential-harvesting technique. Once they can access your work email, they have far more than basic information.',
        scoreImpact: -25,
      },
      {
        id: 'social-002-b',
        text: 'Click the form link to look at what it asks before deciding.',
        isCorrect: false,
        feedback:
          'Even visiting the link tells attackers your account is active and may expose your device to malicious scripts. Assess the request before clicking anything.',
        scoreImpact: -15,
      },
      {
        id: 'social-002-c',
        text: 'Ignore the message. If you\'re interested, research the company independently to find legitimate contact details.',
        isCorrect: true,
        feedback:
          'Correct. A brand-new profile with few connections and a Google Form instead of a company domain are clear warning signs. If the opportunity is real, the company will have a verifiable website and legitimate HR contact.',
        scoreImpact: 25,
      },
      {
        id: 'social-002-d',
        text: 'Share only your name and personal email — nothing work-related.',
        isCorrect: false,
        feedback:
          'Providing any details engages the scammer and exposes you to follow-up phishing on your personal email. The right move is to disengage entirely.',
        scoreImpact: -10,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 10. Spoofed colleague email — data exfiltration request
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: 'spoof-001',
    title: 'Sarah Needs the Salary File',
    description:
      'You receive an email from your colleague Sarah Johnson in HR, asking you to send her the spreadsheet containing all employee salary data urgently. External auditors are apparently on-site and waiting. The email feels slightly rushed.',
    context: [
      'FROM: Sarah Johnson <sarah.johnson@acme-corp.co>',
      'TO: you@acme-corp.com',
      'SUBJECT: Urgent — salary data for audit',
      '---',
      'Hi,',
      '',
      'The auditors just arrived and I\'ve forgotten',
      'to pull the salary spreadsheet. Could you',
      'send it over right away? They\'re waiting.',
      '',
      'Thanks so much,',
      'Sarah',
      '',
      '⚠ NOTE: Sarah\'s real address is:',
      'sarah.johnson@acme-corp.com',
      'This came from: acme-corp.co',
    ].join('\n'),
    contextType: 'email',
    category: 'phishing',
    difficulty: 'hard',
    lesson:
      'Attackers research company structures to impersonate trusted colleagues convincingly. Sensitive data — salary records, personal data, financial information — should never be sent based on an email alone. For any request involving confidential files, verify face-to-face or by phone using details you already have.',
    choices: [
      {
        id: 'spoof-001-a',
        text: 'Send the spreadsheet — Sarah works in HR and an audit request sounds routine.',
        isCorrect: false,
        feedback:
          'The sender domain is ".co" not ".com". Sending employee salary data to an attacker is a serious data breach with legal and financial consequences for your company.',
        scoreImpact: -30,
      },
      {
        id: 'spoof-001-b',
        text: 'Reply to the email asking Sarah to confirm she really needs it.',
        isCorrect: false,
        feedback:
          'Replying to a spoofed email confirms the request with the attacker, who will say "yes, please send it immediately." Always verify through a separate channel.',
        scoreImpact: -15,
      },
      {
        id: 'spoof-001-c',
        text: 'Notice the sender domain looks wrong and walk over to Sarah\'s desk to confirm the request.',
        isCorrect: true,
        feedback:
          'Correct on both counts. Spotting the mismatched domain is the technical catch; verifying in person is the secure response. If Sarah didn\'t send it, report it to IT immediately.',
        scoreImpact: 30,
      },
      {
        id: 'spoof-001-d',
        text: 'Forward it to your manager and ask them to decide.',
        isCorrect: false,
        feedback:
          'Escalating without noting your suspicion means your manager may not spot the spoofed domain. Always say "this email address looks wrong to me" when you pass it on.',
        scoreImpact: -5,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

/** Returns all scenarios applicable to the given role. */
export function getScenariosForRole(roleId: string): Scenario[] {
  return SCENARIOS.filter(
    (s) => !s.roleFilter || s.roleFilter.includes(roleId as RoleId),
  );
}
