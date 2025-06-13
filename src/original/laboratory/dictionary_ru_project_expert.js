const dictionary_ru_project_expert = [
    {
        ru_title: "Прибыли-убытки", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Чистый объем продаж",
            "Суммарные прямые издержки",
            "Валовая прибыль",
            "Налог на имущество",
            "Суммарные постоянные издержки",
            "Суммарные непроизводственные издержки",
            "Прибыль до выплаты налога",
            "Налогооблагаемая прибыль",
            "Чистая прибыль"
        ]
    },

    {
        ru_title: "Чистый объем продаж", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Валовый объем продаж", add: true },
            { ru_title: "Потери", add: false },
            { ru_title: "Налоги с продаж", add: false }
        ]
    },

    { ru_title: "Валовый объем продаж", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Потери", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Налоги с продаж", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарные прямые издержки", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Материалы и комплектующие", add: true },
            { ru_title: "Сдельная зарплата", add: true }
        ]
    },

    { ru_title: "Материалы и комплектующие", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Сдельная зарплата", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Валовая прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Чистый объем продаж", add: true },
            { ru_title: "Суммарные прямые издержки", add: false }
        ]
    },

    { ru_title: "Налог на имущество", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарные постоянные издержки", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Административные издержки", add: true },
            { ru_title: "Производственные издержки", add: true },
            { ru_title: "Маркетинговые издержки", add: true },
            { ru_title: "Зарплата административного персонала", add: true },
            { ru_title: "Зарплата производственного персонала", add: true },
            { ru_title: "Зарплата маркетингового персонала", add: true }
        ]
    },

    { ru_title: "Административные издержки", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Производственные издержки", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Маркетинговые издержки", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Зарплата административного персонала", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Зарплата производственного персонала", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Зарплата маркетингового персонала", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарные непроизводственные издержки", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Амортизация", add: true },
            { ru_title: "Проценты по кредитам", add: true }
        ]
    },

    { ru_title: "Амортизация", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Проценты по кредитам", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    { ru_title: "Другие доходы", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Другие издержки", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    { ru_title: "Убытки предыдущих периодов", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Прибыль до выплаты налога", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Суммарные издержки, отнесенные на прибыль",
            "Прибыль от курсовой разницы"
        ]
    },
    { ru_title: "Суммарные издержки, отнесенные на прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Прибыль от курсовой разницы", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Налогооблагаемая прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Валовая прибыль", add: true },
            { ru_title: "Налог на имущество", add: false },
            { ru_title: "Суммарные постоянные издержки", add: false },
            { ru_title: "Суммарные непроизводственные издержки", add: false },
            { ru_title: "Другие доходы", add: true },
            { ru_title: "Другие издержки", add: true }
        ]
    },
    { ru_title: "Налог на прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    { ru_title: "Чистая прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Кэш-фло", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Кэш-фло от операционной деятельности",
            "Кэш-фло от инвестиционной деятельности",
            "Кэш-фло от финансовой деятельности",
            "Баланс наличности на начало периода",
            "Баланс наличности на конец периода"
        ]
    },

    {
        ru_title: "Кэш-фло от операционной деятельности", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Поступления от продаж", add: true },
            { ru_title: "Суммарные прямые издержки (выплаты)", add: false },
            { ru_title: "Суммарные постоянные издержки (выплаты)", add: false },
            { ru_title: "Вложения в краткосрочные ценные бумаги", add: false },
            { ru_title: "Доходы по краткосрочным ценным бумагам", add: true },
            { ru_title: "Другие поступления", add: true },
            { ru_title: "Другие выплаты", add: false },
            { ru_title: "Налоги", add: false }
        ]
    },


    { ru_title: "Поступления от продаж", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарные прямые издержки (выплаты)", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Затраты на материалы и комплектующие", add: true },
            { ru_title: "Затраты на сдельную заработную плату", add: true }
        ]
    },

    { ru_title: "Затраты на материалы и комплектующие", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Затраты на сдельную заработную плату", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарные постоянные издержки (выплаты)", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Общие издержки", add: true },
            { ru_title: "Затраты на персонал", add: true }
        ]
    },

    { ru_title: "Общие издержки", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Затраты на персонал", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    
    { ru_title: "Вложения в краткосрочные ценные бумаги", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Доходы по краткосрочным ценным бумагам", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Другие поступления", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Другие выплаты", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Налоги", ru_comment: "", ru_source: "Project Expert", dependent: [] },
   

    {
        ru_title: "Кэш-фло от инвестиционной деятельности", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Затраты на приобретение активов", add: false },
            { ru_title: "Другие издержки подготовительного периода", add: false },
            { ru_title: "Поступления от реализации активов", add: true },
            { ru_title: "Приобретение прав собственности (акций)", add: false },
            { ru_title: "Продажа прав собственности", add: true },
            { ru_title: "Доходы от инвестиционной деятельности", add: true }
        ]
    },

    { ru_title: "Затраты на приобретение активов", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Другие издержки подготовительного периода", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Поступления от реализации активов", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Приобретение прав собственности (акций)", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Продажа прав собственности", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Доходы от инвестиционной деятельности", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Кэш-фло от финансовой деятельности", ru_comment: "", ru_source: "Project Expert", dependent: [
            { ru_title: "Собственный (акционерный) капитал", add: true },
            { ru_title: "Займы", add: true },
            { ru_title: "Выплаты в погашение займов", add: false },
            { ru_title: "Выплаты процентов по займам", add: false },
            { ru_title: "Лизинговые платежи", add: false },
            { ru_title: "Выплаты дивидендов", add: false }
        ]
    },

    { ru_title: "Собственный (акционерный) капитал", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Займы", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Выплаты в погашение займов", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Выплаты процентов по займам", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Лизинговые платежи", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Выплаты дивидендов", ru_comment: "", ru_source: "Project Expert", dependent: [] },


    { ru_title: "Баланс наличности на начало периода", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Баланс наличности на конец периода", ru_comment: "", ru_source: "Project Expert", dependent: [
        { ru_title: "Баланс наличности на начало периода", add: false },
        { ru_title: "Кэш-фло от операционной деятельности", add: false },
        { ru_title: "Кэш-фло от инвестиционной деятельности", add: false },
        { ru_title: "Кэш-фло от финансовой деятельности", add: false }
    ] },


    {
        ru_title: "Баланс", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Суммарный актив",
            "Суммарный пассив"
        ]
    },

    {
        ru_title: "Суммарный актив", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Суммарные текущие активы",
            "Остаточная стоимость основных средств",
            "Инвестиции в основные средства",
            "Инвестиции в ценные бумаги",
            "Имущество в лизинге"
        ]
    },

    {
        ru_title: "Суммарные текущие активы", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Денежные средства",
            "Счета к получению",
            "Сырье, материалы и комплектующие",
            "Запасы готовой продукции",
            "Банковские вклады и ценные бумаги",
            "Краткосрочные предоплаченные расходы"
        ]
    },

    { ru_title: "Денежные средства", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Счета к получению", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Сырье, материалы и комплектующие", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Незавершенное производство", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Запасы готовой продукции", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Банковские вклады и ценные бумаги", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Краткосрочные предоплаченные расходы", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Остаточная стоимость основных средств", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Основные средства",
            "Накопленная амортизация"
        ]
    },

    { ru_title: "Основные средства", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Накопленная амортизация", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    { ru_title: "Земля", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Здания и сооружения", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Оборудование", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Предоплаченные расходы", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Другие активы", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    { ru_title: "Инвестиции в основные средства", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Инвестиции в ценные бумаги", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Имущество в лизинге", ru_comment: "", ru_source: "Project Expert", dependent: [] },




    {
        ru_title: "Суммарный пассив", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Суммарный собственный капитал",
            "Долгосрочные обязательства",
            "Суммарные краткосрочные обязательства"
        ]
    },

    {
        ru_title: "Суммарные краткосрочные обязательства", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Отсроченные налоговые платежи",
            "Краткосрочные займы",
            "Счета к оплате",
            "Полученные авансы"
        ]
    },

    { ru_title: "Отсроченные налоговые платежи", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Краткосрочные займы", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Счета к оплате", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Полученные авансы", ru_comment: "", ru_source: "Project Expert", dependent: [] },



    { ru_title: "Долгосрочные обязательства", ru_comment: "", ru_source: "Project Expert", dependent: [] },

    {
        ru_title: "Суммарный собственный капитал", ru_comment: "", ru_source: "Project Expert", dependent: [
            "Обыкновенные акции",
            "Привилегированные акции",
            "Капитал, внесенный сверх номинала",
            "Резервные фонды",
            "Добавочный капитал",
            "Нераспределенная прибыль"
        ]
    },

    { ru_title: "Обыкновенные акции", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Привилегированные акции", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Капитал, внесенный сверх номинала", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Резервные фонды", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Добавочный капитал", ru_comment: "", ru_source: "Project Expert", dependent: [] },
    { ru_title: "Нераспределенная прибыль", ru_comment: "", ru_source: "Project Expert", dependent: [] },


];

export default dictionary_ru_project_expert