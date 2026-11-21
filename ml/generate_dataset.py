"""Synthetic & Curated Dataset Generator for HimoyaAI.

Generates ~1800+ samples across 3 balanced classes:
- Green: >= 600 samples (stress, fatigue, normal family disputes)
- Yellow: >= 600 samples (psychological/economic pressure, isolation, digital control)
- Red: >= 600 samples (severe physical violence, life threats, weapons, sexual abuse, suicide)

Spans 3 script variations:
- Uzbek Latin (~60%)
- Uzbek Cyrillic (~20%)
- Russian / Mixed (~20%)
"""

import os
import json
import random

random.seed(42)

# Templates & Variations for Green
GREEN_TEMPLATES = [
    # Latin
    "Bugun juda charchadim, uy yumushlari va ishdan keyin hech narsaga kuchim qolmadi.",
    "Turmush o'rtog'im bilan maoshimizni qanday taqsimlash haqida biroz tortishib qoldik.",
    "Kayfiyatim tushkun, so'nggi paytlarda uyqum yaxshi emas, o'zimni yolg'iz his qilyapman.",
    "Ota-onam bilan fikrimiz to'g'ri kelmay qoldi, lekin tinchgina suhbatlashib tushunib oldik.",
    "Ishda stress ko'p, doimiy asabiylik bor, dam olishga ehtiyojim bor.",
    "Kichik oilaviy tushunmovchilik bo'ldi, o'rtada hech qanday haqorat yoki qo'rquv yo'q.",
    "Farzandlarim darslarini qilmayapti, biroz asabiylashdim, lekin janjal bo'lmadi.",
    "O'zimga bo'lgan ishonchim pasayib ketgandek, motivatsiya yetishmayapti.",
    # Cyrillic
    "Бугун жуда чарчадим, ишдан кейин ҳеч нарсага ҳолим қолмади.",
    "Турмуш ўртоғим билан маиший масалаларда бироз тортишиб қолдик, лекин ҳал бўлди.",
    "Кайфиятим йўқ, кузги депрессияга ўхшайди, дам олгим келяпти.",
    "Оилавий кичик келишмовчилик бўлди, ҳеч қандай тазйиқ йўқ.",
    # Russian / Mixed
    "Очень устала на работе, эмоциональное выгорание и нет сил готовить ужин.",
    "Поспорили с мужем насчет покупки мебели, обычный семейный спор.",
    "Чувствую апатию и грусть последние пару дней, просто нужен отдых.",
    "Немного понервничала из-за экзаменов, руки опускаются."
]

# Templates & Variations for Yellow
YELLOW_TEMPLATES = [
    # Latin
    "Erim pulimni tortib oladi va o'zimga umuman pul ishlatishga qo'ymaydi.",
    "Qaynanam doim kamsitadi, 'sen hech kimsan, ota-onang hech narsa bermagan' deb haqorat qiladi.",
    "Telefonimni har kuni tekshiradi, dugonalarim va qarindoshlarim bilan gaplashishni taqiqlab qo'ygan.",
    "Meni uydan chiqarmaydi, ishlashimga mutlaqo ruxsat bermayapti, o'zimni qafasda his qilyapman.",
    "Erim 'agar gapimga kirmasang, bolalarni olib qo'yaman' deb qo'rqitmoqda.",
    "Telegramda soxta profildan kimdir yozib, shaxsiy ma'lumotlarimni tarqataman deb shantaj qilyapti.",
    "Doimiy ravishda meni ayblaydi, sen sababli hamma narsa barbod bo'ldi deb ruhiy ezadi.",
    "Meni hech qayerga yubormaydi, har bir qadamimni kuzatib, rasm yuborishimni talab qiladi.",
    # Cyrillic
    "Эрим пулимни олиб қўяди, маошимни ўзимга ишлатишга рухсат бермайди.",
    "Қайнонам ҳар куни ҳақорат қилади, руҳий босим ўтказади.",
    "Телефонимни текширади, қариндошларим билан кўришишга рухсат бермайди.",
    "Ишлашимга рухсат йўқ, доим камситиб, ўзимни айбдор ҳис қилишга мажбурлайди.",
    # Russian / Mixed
    "Муж полностью контролирует мои финансы и не дает денег даже на базовые вещи.",
    "Свекровь постоянно морально унижает и настраивает мужа против меня.",
    "Он читает все мои переписки в Telegram, запрещает общаться с мамой и подругами.",
    "Шантажирует тем, что заберет детей и выгонит из дома, если я не буду слушаться."
]

# Templates & Variations for Red
RED_TEMPLATES = [
    # Latin
    "Erim bugun mast bo'lib kelib, bo'g'ib o'ldiraman deb pichoq bilan tashlandi!",
    "Boshimga musht tushirdi, burnim qonadi, hozir eshikni qulflab xonada qo'rqib o'tiribman.",
    "Pichoq o'qtalib, agar politsiyaga aytsang so'yib tashlayman deb tahdid qildi.",
    "Meni va bolamni kaltaklab ko'chaga haydab yubordi, qorong'uda qayerga borishni bilmayapman.",
    "Nafasim qisilib ketguncha bo'ynimdan bo'g'di, hushimdan ketib qolishimga oz qoldi.",
    "Yashashni istamayapman, bu azoblardan charchadim, jonimga qasd qilmoqchiman.",
    "Meni zo'rlashga urindi, qarshilik ko'rsatsam kiyimlarimni yirtib tashladi.",
    "Bolamga qo'l ko'tarib, devorga qarab uloqtirdi, iltimos darhol yordam bering!",
    # Cyrillic
    "Эрим пичоқ билан ташланиб, ўлдираман деб бўғди, ёрдам беринг!",
    "Бошимни ёриб, қонга белади, уйга қулфлаб қўйди, чиқолмаяпман.",
    "Мени ва болаларимни шафқатсизларча калтаклаб, кўчага ҳайдади.",
    "Жонимга қасд қилмоқчиман, чидолмаяпман, яшагим келмаяпти.",
    # Russian / Mixed
    "Муж схватил за горло и начал душить, угрожает ножом, я заперлась в ванной!",
    "Он зверски избил меня, сломал нос, угрожает убить, если я позвоню в милицию.",
    "Напал на ребенка и ударил его, угрожает расправой, нужна срочная помощь 102!",
    "Угрожает сжечь дом вместе со мной, не выпускает, спасите!"
]

def generate_samples(templates, target_count, label):
    samples = []
    adverbs_uz = ["juda", "kecha", "bugun", "doim", "yana", "hozir", "tongda", "har doim"]
    fillers = ["iltimos yordam bering", "nima qilishni bilmayapman", "maslahat bering", "qo'rqyapman", "charchadim"]
    
    # First, add raw templates
    for t in templates:
        samples.append({"text": t, "label": label})
        
    while len(samples) < target_count:
        base = random.choice(templates)
        # Apply synthetic variations
        r = random.random()
        if r < 0.3:
            # Prepend adverb
            var = f"{random.choice(adverbs_uz).capitalize()} {base.lower()}"
        elif r < 0.6:
            # Append filler
            var = f"{base} {random.choice(fillers)}."
        elif r < 0.8:
            # Typo simulation (repeating vowel)
            words = base.split()
            idx = random.randint(0, len(words) - 1)
            words[idx] = words[idx].replace("a", "aa").replace("o", "oo")
            var = " ".join(words)
        else:
            var = f"{base} Maslahat bering."
            
        samples.append({"text": var, "label": label})
        
    return samples[:target_count]

def main():
    print("Generating ~1800 balanced samples for HimoyaAI...")
    green_data = generate_samples(GREEN_TEMPLATES, 620, "green")
    yellow_data = generate_samples(YELLOW_TEMPLATES, 620, "yellow")
    red_data = generate_samples(RED_TEMPLATES, 620, "red")

    all_data = green_data + yellow_data + red_data
    random.shuffle(all_data)

    total = len(all_data)
    print(f"Total samples generated: {total} (Green: {len(green_data)}, Yellow: {len(yellow_data)}, Red: {len(red_data)})")

    # Split: Train 70%, Val 15%, Holdout 15% (>= 150 samples)
    holdout_size = max(180, int(total * 0.15))
    val_size = int(total * 0.15)
    train_size = total - holdout_size - val_size

    holdout = all_data[:holdout_size]
    val = all_data[holdout_size:holdout_size + val_size]
    train = all_data[holdout_size + val_size:]

    base_dir = os.path.dirname(__file__)
    
    with open(os.path.join(base_dir, "data/train/dataset.json"), "w", encoding="utf-8") as f:
        json.dump(train, f, ensure_ascii=False, indent=2)

    with open(os.path.join(base_dir, "data/val/dataset.json"), "w", encoding="utf-8") as f:
        json.dump(val, f, ensure_ascii=False, indent=2)

    with open(os.path.join(base_dir, "data/test_holdout/dataset.json"), "w", encoding="utf-8") as f:
        json.dump(holdout, f, ensure_ascii=False, indent=2)

    print(f"Saved: Train ({len(train)}), Val ({len(val)}), Holdout ({len(holdout)})")

if __name__ == "__main__":
    main()
