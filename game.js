// ============================
// ИГРОВЫЕ ДАННЫЕ И СОСТОЯНИЕ
// ============================

const gameState = {
    budget: 1000000,
    atmosphere: 75,
    quality: 80,
    currentSituation: 1,
    totalSituations: 15,
    isGameOver: false,
    gameResult: null
};

// ============================
// ПИКСЕЛЬНЫЙ КУРСОР
// ============================

function initPixelCursor() {
    console.log('Инициализация пиксельного курсора...');
    
    try {
        // Удаляем старый курсор, если есть
        const oldCursor = document.getElementById('pixel-cursor');
        if (oldCursor) {
            oldCursor.remove();
        }
        
        // Создаем новый курсор
        const cursor = document.createElement('div');
        cursor.id = 'pixel-cursor';
        cursor.className = 'pixel-cursor';
        
        // Базовые стили для курсора
        cursor.style.cssText = `
            position: fixed;
            width: 24px;
            height: 24px;
            background: #2E7AFF;
            border: 2px solid #000;
            border-radius: 0;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: transform 0.1s, background 0.2s;
            box-shadow: 0 0 12px rgba(46, 122, 255, 0.7);
        `;
        
        document.body.appendChild(cursor);
        console.log('Курсор создан и добавлен в DOM');
        
        // Обновляем позицию курсора
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Анимация клика
        document.addEventListener('click', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 150);
        });
        
        // Меняем цвет при наведении на кнопки
        document.addEventListener('mouseover', (e) => {
            if (e.target.tagName === 'BUTTON' || 
                e.target.classList.contains('btn') || 
                e.target.classList.contains('choice-btn')) {
                cursor.style.background = '#00D48A';
                cursor.style.boxShadow = '0 0 12px rgba(0, 212, 138, 0.7)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.tagName === 'BUTTON' || 
                e.target.classList.contains('btn') || 
                e.target.classList.contains('choice-btn')) {
                cursor.style.background = '#2E7AFF';
                cursor.style.boxShadow = '0 0 12px rgba(46, 122, 255, 0.7)';
            }
        });
        
        console.log('Пиксельный курсор готов к работе');
    } catch (error) {
        console.error('Ошибка при создании курсора:', error);
        // Продолжаем без курсора
    }
}

// ============================
// СИТУАЦИИ И ВЫБОРЫ
// ============================

// 15 ситуаций с сбалансированными показателями
const situations = [
{
        id: 1,
        title: "The Technology Divide",
        text: "The project is just getting started. Your longtime and respected Lead Developer insists on using a proven but outdated technology—this will speed up the launch by a factor of 2. However, the young developers who make up the core of the team are eager to work with a modern tech stack, threatening a drop in motivation and even resignations if their demands aren't met.",
        choices: [
            {
                text: "Listen to the veteran",
                consequences: { budget: +50000, atmosphere: -15, quality: -10 },
                description: "You accept the argument about speed and approve the old tech stack. The team starts working immediately.\n\nExplanation: Savings on training, tools, and resolving compatibility issues provide tangible financial benefits. However, junior developers feel that their expertise isn't valued, which lowers morale. Technical debt is built into the project's foundation."
            },
            {
                text: "Adopt a modern tech stack",
                consequences: { budget: -100000, atmosphere: +15, quality: +10 },
                description: "You prioritize the long-term outlook and the motivation of young professionals, despite the initial costs.\ n\nExplanation: Costs associated with training the team, purchasing tool licenses, and a longer development ramp-up. However, the team is inspired by the trust placed in them and the opportunity to work with cutting-edge technologies, which boosts enthusiasm and ensures long-term code quality."
            },
            {
                text: "Find a compromise",
                consequences: { budget: -50000, atmosphere: +5, quality: 0 },
                description: "You divide the project into modules: the core uses the old stack (under the lead's supervision), while new microservices use the modern stack. This complicates the architecture but defuses the conflict.\n\nExplanation: The costs of maintaining two stacks and ensuring their interoperability. The team as a whole makes the decision, but no one is thrilled. Technical risks are distributed."
            }
        ]
    },
    {
        id: 2,
        title: "Architectural Battle of the Titans",
        text: "During the design phase, two of your strongest senior developers have been locked in a heated debate over the choice of architecture for a key module. One proposes a monolith with a clear structure; the other, microservices with independent scaling. Their dispute has been paralyzing the entire team's work for two days now. Both are respected and unyielding.",
        choices: [
            {
                text: "Authoritatively make a single decision",
                consequences: { budget: 0, atmosphere: -20, quality: -5 },
                description: "As the leader, you review the arguments and, with a single order, choose one of the options, ending the discussion.\n\nExplanation: There are no financial costs, and work continues. However, the losing developer is deeply offended, the winner feels awkward, and the team sees you as a dictator, which stifles openness and initiative."
            },
            {
                text: "Organize a hackathon to find two solutions",
                consequences: { budget: -70000, atmosphere: +10, quality: +10 },
                description: "You give the disputing parties 48 hours and resources so that each can build a small prototype. Then the entire team votes for the best-working solution.\n\nExplanation: Costs for overtime and resources for prototypes. This process turns conflict into healthy competition. The best technical solution wins, and the team feels a sense of ownership."
            },
            {
                text: "Split into Different Modules",
                consequences: { budget: 0, atmosphere: -5, quality: -10 },
                description: "You suggest that everyone implement their own architecture within different, loosely connected parts of the system so they can be compared in a head-to-head test.\n\nExplanation: There are no direct costs. The conflict ends, but the architecture becomes inconsistent, which creates problems with integration and future maintenance."
            }
        ]
    },
    {
        id: 3,
        title: "Weak Spot — QA",
        text: "A week before the end of the sprint, the testers come with bad news: testing a new, complex module—on which half of the sprint's functionality depends—will take 4 more days. Pushing back the sprint deadline is undesirable, since integration with another department is scheduled to follow.",
        choices: [
            {
                text: "Insist on the original deadlines",
                consequences: { budget: 0, atmosphere: -15, quality: -15 },
                description: "You require the QA team to meet the deadline, taking responsibility for the risks.\n\nExplanation: Financially, everything remains on track. However, the testers feel pressured and formally sign off on the release while warning of the risks. Critical bugs may be discovered in production."
            },
            {
                text: "Postpone the module release",
                consequences: { budget: -30000, atmosphere: +5, quality: +15 },
                description: "You officially postpone the internal deadline by 4 days to give the testers more time. This will disrupt the plans of the adjacent department.\n\nExplanation: You'll have to pay penalties for disrupting integration. The QA team feels that their work is valued. Thorough testing allows bugs to be found and fixed before release."
            },
            {
                text: "Assign developers to assist QA",
                consequences: { budget: -15000, atmosphere: +5, quality: +5 },
                description: "You're asking two developers who wrote the module to switch gears for two days to help write automated tests and run manual test scenarios.\n\nExplanation: Costs associated with paying developers for overtime. The timeline is pushed back by only 2 days. The developers gain a better understanding of the testing process."
            }
        ]
    },
    {
        id: 4,
        title: "Star Syndrome",
        text: "Your best and most productive developer, who leads a mission-critical module, has requested an unscheduled meeting with you. He calmly but firmly states that he has received an offer from a competitor with a salary 40% higher. He's willing to stay if you promise him a similar raise from the project budget today.",
        choices: [
            {
                text: "Allocate a bonus from the project budget",
                consequences: { budget: -120000, atmosphere: -10, quality: 0 },
                description: "Aware of the risks, you find the money and promise him a raise, violating the salary range and the project budget.\n\nExplanation: The annual salary overpayment represents a significant amount of the budget. When colleagues find out they've been left without a bonus, they feel it's unfair."
            },
            {
                text: "Explain that the raise is strictly according to plan",
                consequences: { budget: 0, atmosphere: -20, quality: -15 },
                description: "You refuse, citing company policy and fairness toward other team members, whose contributions are also significant.\ n\nExplanation: The budget is preserved. However, the developer may leave, taking their unique knowledge of a key module with them. Replacing them on short notice will be more expensive."
            },
            {
                text: "Offer non-financial incentives",
                consequences: { budget: -40000, atmosphere: +10, quality: +5 },
                description: "You offer a package: a mentoring role for junior developers with a mentoring bonus, coverage of expensive certifications, and a flexible schedule. Their pay will increase, but not as sharply.\n\nExplanation: Costs for courses, certifications, and a small bonus. The developer appreciates the investment in their growth and new status, and the team gains a mentor."
            }
        ]
    },
    {
        id: 5,
        title: "The Joking Client",
        text: "After a successful demo of the feature prototype, a key client is thrilled, but he's come up with a 'small' idea that radically changes the logic of the widget—the main feature of the current sprint. Implementing this idea will require reworking 70% of the work already completed. The sprint ends in 3 days.",
        choices: [
            {
                text: "Proceed, even if it derails the sprint",
                consequences: { budget: -70000, atmosphere: -15, quality: -12 },
                description: "You tell the team that they'll have to rewrite the code. The sprint and deadline are missed, but the client will be happy.\n\nExplanation: Costs for rework and overtime pay. The team is furious about the chaos and the devaluation of their previous work. Due to the rush, workarounds are added to the code."
            },
            {
                text: "Firmly refuse, citing processes",
                consequences: { budget: 0, atmosphere: +5, quality: +10 },
                description: "You politely refuse the client, explaining that changes of this scale can only be implemented in the next planning cycle.\ n\nExplanation: The budget and plan are preserved. The team appreciates the stability. However, the client is dissatisfied with the 'lack of flexibility,' which jeopardizes a future contract."
            },
            {
                text: "Add to the backlog and suggest discussing priorities",
                consequences: { budget: -20000, atmosphere: +10, quality: +5 },
                description: "You log the request as a new task with the highest priority and suggest that you and the client decide together which of the features planned for the next sprint should be replaced with this one.\n\nExplanation: Costs associated with the additional time the manager and team spend on replanning. You show the team that their plan is respected, and the client that they are being heard."
            }
        ]
    },
    {
        id: 6,
        title: "The Ghost in the Machine",
        text: "A month after the successful release, one of the testers discovered a serious but not immediately obvious bug in the payment system. The bug occurs in a very rare scenario. It can be quietly fixed in an update already scheduled for two weeks from now. Or we could raise the alarm, recall the release, and issue an urgent hotfix, drawing widespread attention.",
        choices: [
            {
                text: "Fix it quietly in the scheduled update",
                consequences: { budget: 0, atmosphere: +10, quality: 0 },
                description: "You decide not to publicize the issue so as not to cause panic or undermine trust. The team fixes the bug 'quietly.'\n\nExplanation: There are no direct costs."
            },
            {
                text: "Release an urgent hotfix",
                consequences: { budget: -50000, atmosphere: -5, quality: +10 },
                description: "You publicly acknowledge the error, apologize to users, and mobilize the team to release a fix around the clock.\n\nExplanation: Costs associated with emergency work. Clients see the highest level of accountability. The team feels exhausted."
            },
            {
                text: "Notify key clients and offer a bonus",
                consequences: { budget: -50000, atmosphere: +7, quality: +8 },
                description: "You personally write to several of the most important clients, warn them about the bug, offer compensation, and provide a fix date.\n\nExplanation: Costs associated with compensation and expedited development of the fix. You turn a crisis into an opportunity to strengthen relationships with key partners."
            }
        ]
    },
    {
        id: 7,
        title: "The Leader's Shadow",
        text: "Your team lead, who has always been your right-hand person and pillar of support, has changed drastically over the past two weeks: he gets irritated over trivial matters, skips daily planning meetings, and misses the deadlines for technical documentation that were agreed upon with him. The team is starting to whisper among themselves. The project is at a critical stage.",
        choices: [
            {
                text: "Have a tough conversation about the results",
                consequences: { budget: 0, atmosphere: -20, quality: -10 },
                description: "You call him in and demand an explanation, emphasizing that his behavior is jeopardizing the project.\n\nExplanation: No financial investment. The team lead will either quit under stress or withdraw even further. The team loses faith in you."
            },
            {
                text: "Take over some of his tasks and let him rest",
                consequences: { budget: -100000, atmosphere: +10, quality: 0 },
                description: "You suggest he take a week off, and in the meantime, you dive into his tasks to lighten his load.\n\nExplanation: The cost of your overtime. The team lead recovers and returns with immense gratitude. The team sees you as a true leader."
            },
            {
                text: "Temporarily replace him with someone from the team",
                consequences: { budget: -50000, atmosphere: 0, quality: -10 },
                description: "You ask a less experienced tech lead for help for a month so they can help clear the backlog and lighten your team lead's load.\n\nExplanation: Costs associated with another specialist. Product quality has decreased, but the team lead has regained their strength."
            }
        ]
    },
    {
        id: 8,
        title: "Public Failure",
        text: "During a key product demo for potential investors, at the most crucial moment, the program 'freezes' and crashes with a critical error. The technical cause is already clear to your developers (a library conflict) and can be fixed in an hour. But the first impression is ruined. Everyone is looking at you.",
        choices: [
            {
                text: "Find the culprit on the team",
                consequences: { budget: 0, atmosphere: -25, quality: -10 },
                description: "You publicly reprimand the developer responsible for the build in front of everyone, demonstrating to the investors that you're in control of the situation and restoring order.\n\nExplanation: Investors may see this as 'decisiveness.' However, it creates a culture of fear and blame within the team."
            },
            {
                text: "Take the blame and present a plan",
                consequences: { budget: -20000, atmosphere: +22, quality: +12 },
                description: "You apologize to the investors, take responsibility as the leader, and immediately outline a brief plan to correct the issue and prevent it from happening in the future.\n\nExplanation: Costs associated with organizing a repeat demo. The team is shocked and filled with deep respect. Investors appreciate the leader's maturity and sense of responsibility."
            },
            {
                text: "Turn it into a joke and show the backup version",
                consequences: { budget: 0, atmosphere: +8, quality: -5 },
                description: "You say with a smile: 'Here it is—the harsh reality of a live demo!' You joke and quickly switch to a pre-prepared, stable backup version of the product on your laptop.\n\nExplanation: No costs. Investors will appreciate your charisma, but deep down they'll doubt the product's reliability."
            }
        ]
    },
    {
        id: 9,
        title: "The Enemy Within",
        text: "You happen to find out that another department in the company (Department B) is secretly prototyping a tool very similar to the core of your product. Upon learning this, the CEO doesn't stop anyone but instead proposes a 'healthy competition'—whose prototype turns out to be better in two months will receive the budget for full-scale development.",
        choices: [
            {
                text: "Get caught up in the excitement, tell the team what you know",
                consequences: { budget: -100000, atmosphere: +10, quality: +10 },
                description: "You declare a 'mobilization' against Department B to your team, cut off all communication with them, and throw all resources into winning the race.\n\nExplanation: Additional expenses for overtime. The team unites against a common 'enemy,' creating a sense of excitement."
            },
            {
                text: "Propose joining forces",
                consequences: { budget: +50000, atmosphere: -15, quality: +15 },
                description: "You approach the head of Department B and the CEO with a proposal to merge the teams and combine their best ideas to create a single, super product.\n\nExplanation: Cost savings from combining budgets. The process of merging teams is painful, but the final product is powerful."
            },
            {
                text: "Tactfully withdraw from the race by reorienting your strategy",
                consequences: { budget: 0, atmosphere: -10, quality: +10 },
                description: "You analyze your product's strengths and find a related but distinct market niche for it where there is no internal competition.\ n\nExplanation: The budget remains unchanged. The team is somewhat disappointed by your retreat from the battlefield, but you avoid a destructive internal conflict and preserve the product's quality."
            }
        ]
    },
    {
        id: 10,
        title: "Chasing the Trend",
        text: "An article has appeared on the blog about a promising new framework that will 'solve everything.' The junior and mid-level developers on your team are excited about the idea of immediately rewriting one of the new modules using it. They claim it will speed up development in the future. Your architect is skeptical and points out the risks of instability.",
        choices: [
            {
                text: "Allow the experiment in production",
                consequences: { budget: -70000, atmosphere: +15, quality: -20 },
                description: "You give the go-ahead to use the new framework in a live module for a new client to test it in a real-world environment.\n\nExplanation: Costs associated with learning, integration, and resolving inevitable issues. The enthusiasts are happy, but the tool may turn out to be very unpolished."
            },
            {
                text: "Strictly prohibit it, citing stability",
                consequences: { budget: 0, atmosphere: -15, quality: 0 },
                description: "You veto the proposal, citing the policy of using only proven technologies and the architect's opinion.\n\nExplanation: Stability and budget are preserved. However, the most curious developers might consider leaving."
            },
            {
                text: "Allocate a hackathon to test product clones",
                consequences: { budget: -50000, atmosphere: +10, quality: +5 },
                description: "You allow enthusiasts to spend 2 days trying to implement the same module on a new framework in an isolated sandbox environment and submit a report.\n\nExplanation: Minimal costs associated with paying the team's time for the research. Developers satisfy their curiosity and obtain objective data."
            }
        ]
    },
    {
        id: 11,
        title: "Pressure from Above",
        text: "Senior management, impressed by a competitor's success, is demanding that you 'make a breakthrough'—cut the remaining development time for key features by 40% to 'capture the market.' Their arguments are purely based on business metrics; they don't delve into the technical details. Refusing could cost you their trust.",
        choices: [
            {
                text: "Agree and give the team an unrealistic plan",
                consequences: { budget: 0, atmosphere: -25, quality: -15 },
                description: "You accept the ultimatum and pass down a new, chronologically impossible plan to the team, demanding heroism.\n\nExplanation: The budget isn't formally affected. The team tries, but after a month, they miss all deadlines while suffering from burnout."
            },
            {
                text: "Present the data and refuse",
                consequences: { budget: 0, atmosphere: +20, quality: +5 },
                description: "You prepare a presentation with data on the team's performance, risk assessments, and a forecast of failure, and you refuse on principle, defending the team and the realism of the plans.\ n\nExplanation: Financially, nothing changes. Management will either respect your principled stance or replace you. The team will idolize you as their defender."
            },
            {
                text: "Propose an MVP on a tight schedule, followed by iterations",
                consequences: { budget: -50000, atmosphere: -10, quality: -10 },
                description: "You agree to shorten the timeline, but propose releasing a heavily stripped-down version (MVP) by that deadline, with the rest to be refined after market launch.\n\nExplanation: Additional costs for urgent redesign. Management is fairly open to compromise. The team is overloaded, and the quality of the first version is low."
            }
        ]
    },
    {
        id: 12,
        title: "The Gray Area",
        text: "Your analyst suggests illegally—but technically straightforward—'scraping' (automatically collecting) some key data from your main competitor's public website. This will save you weeks of marketing analysis and give you a huge advantage. There is a formal legal risk, but it's very low if you proceed carefully.",
        choices: [
            {
                text: "Give the go-ahead 'under the table'",
                consequences: { budget: +50000, atmosphere: -5, quality: 0 },
                description: "You say: 'Go ahead, but I don't know anything about it. And make sure it's technically sound and leaves no traces.'\n\nExplanation: Saves money on expensive legal market research. However, some team members will be shocked and disappointed when they find out about the decision."
            },
            {
                text: "Strictly prohibit",
                consequences: { budget: -500000, atmosphere: +10, quality: +5 },
                description: "You directly and publicly prohibit this practice within the team, explaining the ethical and reputational risks, and suggest looking for legal—albeit longer—alternatives.\ n\nExplanation: Costs associated with legal analysis tools. The team prides itself on the integrity and transparency of its work."
            },
            {
                text: "Pretend not to notice",
                consequences: { budget: +25000, atmosphere: +5, quality: 0 },
                description: "You don't give direct permission, but you don't forbid it either, leaving the decision up to the analyst's conscience. 'I'm not aware of the details of your methods.'\n\nExplanation: Partial savings. Proactive employees will do this on their own. You remain informed but don't control the process."
            }
        ]
    },
    {
        id: 13,
        title: "A Difficult Contractor",
        text: "A remote contractor team from another city, responsible for an important but isolated module, consistently misses agreed-upon deadlines by 20–30% and delivers low-quality code with trivial errors. It's difficult to terminate the contract early due to legal complications and their manager's personal connections with your superiors.",
        choices: [
            {
                text: "Tighten oversight and impose penalties",
                consequences: { budget: -50000, atmosphere: -10, quality: -10 },
                description: "You start daily conference calls, demand hourly reports, and include financial penalties for missed deadlines in a supplementary agreement.\n\nExplanation: The cost of your time and the administration of fines. The relationship becomes toxic and hostile."
            },
            {
                text: "Go to their office for a week",
                consequences: { budget: -100000, atmosphere: +15, quality: +15 },
                description: "You fly out to meet with the team in person, understand the root of the problems, and help get things back on track.\n\nExplanation: High travel costs. But you identify the real cause of the problems and help resolve it. They go from being enemies to partners."
            },
            {
                text: "Gradually transfer tasks to your own team",
                consequences: { budget: -50000, atmosphere: -10, quality: +5 },
                description: "You quietly begin assigning the most critical tasks to your developers, leaving only secondary functions to the contractors.\ n\nExplanation: The cost of overloading your developers. You minimize direct damage to the project. However, your team burns out from the double workload."
            }
        ]
    },
    {
        id: 14,
        title: "Successful Burnout",
        text: "Your team has just brilliantly completed and launched the most challenging phase of the project, receiving rave reviews from management and the client. Euphoria. Now that the team has caught its breath, it wants to relax: they suggest taking a week-long break to unwind, do some puzzles, or work on personal pet projects for fun. New project tasks are already waiting.",
        choices: [
            {
                text: "Set ambitious new goals immediately",
                consequences: { budget: 0, atmosphere: -20, quality: -5 },
                description: "You say: 'Great job! Now, according to the plan, we're moving on to the next phase—here's the technical specification, and the deadlines are even tighter.'\n\nExplanation: You're burning through the motivation gained from success. The team feels like they're on an assembly line; their enthusiasm gives way to disappointment."
            },
            {
                text: "Allow a 'free creativity' week",
                consequences: { budget: -100000, atmosphere: +20, quality: +10 },
                description: "You officially declare an 'innovation week': the team can do anything related to technology or product improvement, without plans or reports.\n\nExplanation: The cost of funding this week. The team has had a chance to relax and try new things. Brilliant ideas often emerge under such conditions."
            },
            {
                text: "Hold a celebration and ease the team back into their routine",
                consequences: { budget: -50000, atmosphere: +10, quality: 0 },
                description: "You organize a company party with an awards ceremony, give the team 2–3 days off, and then gather them for a light planning meeting to discuss new, less demanding tasks.\n\nExplanation: Costs for organizing the celebration. Everyone feels a sense of recognition and that this phase has been successfully completed."
            }
        ]
    },
    {
        id: 15,
        title: "The Finale—A Crossroads",
        text: "The project has officially concluded and been deemed a success. As a successful leader, senior management is inviting you to lead a new, more ambitious, and prestigious strategic project. However, there are plans to disband your current, well-coordinated team—the developers will be spread out across other, less interesting projects within the company. Your decision will set the tone for your reputation within the company.",
        choices: [
            {
                text: "I'd be happy to accept the offer",
                consequences: { budget: 0, atmosphere: -35, quality: 0 },
                description: "You thank the team for their work, say goodbye, and throw yourself headfirst into the new challenge, taking a step up the career ladder.\n\nExplanation: You're making a career leap. However, your team feels like they've been used as tools. Your reputation as someone who uses people will become entrenched."
            },
            {
                text: "Decline and remain the 'father' of the product",
                consequences: { budget: 0, atmosphere: +10, quality: +10 },
                description: "You turn down the promotion to stay with your current product and team, protecting them from being disbanded and burning out on routine tasks.\n\nExplanation: You become a legend and a model of loyalty for your team. However, your career growth within the company slows down dramatically."
            },
            {
                text: "Accept the offer, but take key people with you",
                consequences: { budget: +50000, atmosphere: -5, quality: -10 },
                description: "You negotiate with management to transfer 3–4 of the most talented and loyal members of your old team to the new project, forming the core of a 'dream team.'\n\nExplanation: You receive a bonus for successfully transitioning key specialists. However, you may be accused of 'cannibalism' and destroying the old, successful product."
            }
        ]
    }
];

// ============================
// ФУНКЦИИ РАБОТЫ С ИНТЕРФЕЙСОМ
// ============================

function getMetricColor(value, type) {
    let thresholds;
    
    switch(type) {
        case 'budget':
            thresholds = { good: 600000, medium: 300000 };
            break;
        case 'atmosphere':
            thresholds = { good: 70, medium: 40 };
            break;
        case 'quality':
            thresholds = { good: 70, medium: 40 };
            break;
    }
    
    if (value >= thresholds.good) return 'good';
    if (value >= thresholds.medium) return 'medium';
    return 'bad';
}

function updateMetricsDisplay() {
    // Обновляем значения
    const budgetElement = document.getElementById('budget-value');
    const atmosphereElement = document.getElementById('atmosphere-value');
    const qualityElement = document.getElementById('quality-value');
    
    if (budgetElement) budgetElement.textContent = `${gameState.budget.toLocaleString('ru-RU')} ₽`;
    if (atmosphereElement) atmosphereElement.textContent = `${gameState.atmosphere}%`;
    if (qualityElement) qualityElement.textContent = `${gameState.quality}%`;
    
    // Обновляем ширину полосок
    const budgetPercent = Math.min(Math.max(gameState.budget / 1500000 * 100, 0), 100);
    const atmospherePercent = Math.min(Math.max(gameState.atmosphere, 0), 100);
    const qualityPercent = Math.min(Math.max(gameState.quality, 0), 100);
    
    const budgetBar = document.getElementById('budget-bar');
    const atmosphereBar = document.getElementById('atmosphere-bar');
    const qualityBar = document.getElementById('quality-bar');
    
    if (budgetBar) budgetBar.style.width = `${budgetPercent}%`;
    if (atmosphereBar) atmosphereBar.style.width = `${atmospherePercent}%`;
    if (qualityBar) qualityBar.style.width = `${qualityPercent}%`;
    
    // Обновляем цвета
    if (budgetBar) budgetBar.className = `metric-bar ${getMetricColor(gameState.budget, 'budget')}`;
    if (atmosphereBar) atmosphereBar.className = `metric-bar ${getMetricColor(gameState.atmosphere, 'atmosphere')}`;
    if (qualityBar) qualityBar.className = `metric-bar ${getMetricColor(gameState.quality, 'quality')}`;
    
    // Обновляем оставшиеся кризисы
    const crisesLeft = gameState.totalSituations - gameState.currentSituation + 1;
    const crisesLeftElement = document.getElementById('crises-left');
    if (crisesLeftElement) crisesLeftElement.textContent = crisesLeft;
}

function switchScreen(screenId) {
    console.log(`Переключение на экран: ${screenId}`);
    
    document.querySelectorAll('.game-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log(`Экран ${screenId} активирован`);
    } else {
        console.error(`Экран ${screenId} не найден!`);
    }
}

function loadSituation(situationId) {
    console.log(`Загрузка ситуации #${situationId}`);
    
    const situation = situations.find(s => s.id === situationId);
    
    if (!situation) {
        console.log('Ситуации закончились, завершаем игру');
        endGame();
        return;
    }
    
    // Обновляем заголовок
    const titleElement = document.getElementById('situation-title');
    const textElement = document.getElementById('situation-text');
    const crisisNumberElement = document.getElementById('crisis-number');
    
    if (titleElement) titleElement.textContent = situation.title;
    if (textElement) textElement.textContent = situation.text;
    if (crisisNumberElement) crisisNumberElement.textContent = situationId;
    
    // Обновляем прогресс
    const currentSituationElement = document.getElementById('current-situation');
    const progressBarElement = document.getElementById('progress-bar');
    
    if (currentSituationElement) currentSituationElement.textContent = situationId;
    if (progressBarElement) progressBarElement.style.width = `${(situationId / gameState.totalSituations) * 100}%`;
    
    // Обновляем активные шаги прогресса
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < situationId) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Очищаем предыдущие варианты
    const choicesContainer = document.getElementById('choices-container');
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        // Создаем кнопки для каждого варианта
        situation.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.innerHTML = `<span class="choice-index">${index + 1}</span> ${choice.text}`;
            
            // Сохраняем данные о выборе
            button.dataset.consequences = JSON.stringify(choice.consequences);
            button.dataset.description = choice.description;
            
            // Обработчик выбора
            button.addEventListener('click', () => makeChoice(button, choice));
            
            choicesContainer.appendChild(button);
        });
    }
    
    // Скрываем панель последствий
    const consequencePanel = document.getElementById('consequence-panel');
    if (consequencePanel) consequencePanel.style.display = 'none';
    
    console.log(`Ситуация #${situationId} загружена`);
}

// ============================
// ОСНОВНАЯ ИГРОВАЯ ЛОГИКА
// ============================

function makeChoice(button, choice) {
    console.log('Выбор сделан:', choice.text);
    console.log('Состояние ДО применения:', gameState.budget, gameState.atmosphere, gameState.quality);
    
    // Анимация курсора
    const cursor = document.getElementById('pixel-cursor');
    if (cursor) {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        setTimeout(() => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    }
    
    // Получаем последствия
    const consequences = JSON.parse(button.dataset.consequences);
    
    // Применяем последствия
    gameState.budget += consequences.budget;
    gameState.atmosphere += consequences.atmosphere;
    gameState.quality += consequences.quality;

    console.log('Состояние ПОСЛЕ применения:', gameState.budget, gameState.atmosphere, gameState.quality);
    
    // Ограничиваем значения
    gameState.budget = Math.min(Math.max(gameState.budget, 0), 1500000);
    gameState.atmosphere = Math.min(Math.max(gameState.atmosphere, 0), 100);
    gameState.quality = Math.min(Math.max(gameState.quality, 0), 100);
    
    // Обновляем метрики
    updateMetricsDisplay();
    
    // Отключаем все кнопки
    const choiceButtons = document.querySelectorAll('.choice-btn');
    choiceButtons.forEach(btn => {
        btn.disabled = true;
    });
    
    // Выделяем выбранную кнопку
    button.classList.add('selected');
    
    // Показываем последствия
    showConsequences(choice);
    
    // Проверяем критические пороги
    checkCriticalThresholds();
}

function showConsequences(choice) {
    console.log('Показ последствий');
    
    const consequencePanel = document.getElementById('consequence-panel');
    const consequenceText = document.getElementById('consequence-text');
    const consequenceMetrics = document.getElementById('consequence-metrics');
    
    if (!consequencePanel || !consequenceText || !consequenceMetrics) return;
    
    // Заполняем текст последствий
    consequenceText.innerHTML = choice.description.replace(/\n/g, '<br>');
    
    // Создаем метрики последствий
    let metricsHTML = '';
    
    if (choice.consequences.budget !== 0) {
        const className = choice.consequences.budget > 0 ? 'positive' : 'negative';
        const sign = choice.consequences.budget > 0 ? '+' : '';
        metricsHTML += `<div class="consequence-metric ${className}">
            💰 BUDGET: ${sign}${choice.consequences.budget.toLocaleString('ru-RU')} ₽
        </div>`;
    }
    
    if (choice.consequences.atmosphere !== 0) {
        const className = choice.consequences.atmosphere > 0 ? 'positive' : 'negative';
        const sign = choice.consequences.atmosphere > 0 ? '+' : '';
        metricsHTML += `<div class="consequence-metric ${className}">
            👥 MOOD: ${sign}${choice.consequences.atmosphere}%
        </div>`;
    }
    
    if (choice.consequences.quality !== 0) {
        const className = choice.consequences.quality > 0 ? 'positive' : 'negative';
        const sign = choice.consequences.quality > 0 ? '+' : '';
        metricsHTML += `<div class="consequence-metric ${className}">
            🛠️ QUALITY: ${sign}${choice.consequences.quality}%
        </div>`;
    }
    
    consequenceMetrics.innerHTML = metricsHTML;
    
    // Показываем панель
    consequencePanel.style.display = 'block';
    consequencePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    console.log('Последствия показаны');
}

function nextSituation() {
    console.log('Переход к следующей ситуации');
    
    gameState.currentSituation++;
    
    if (gameState.currentSituation > gameState.totalSituations) {
        console.log('Игра завершена! Вызываем endGame()');
        endGame();
    } else {
        loadSituation(gameState.currentSituation);
    }
}

function checkCriticalThresholds() {
    if (gameState.budget <= 0) {
        gameState.gameResult = 'fail_budget';
        showFailScreen();
        return;
    }
    
    if (gameState.atmosphere <= 20) {
        gameState.gameResult = 'fail_atmosphere';
        showFailScreen();
        return;
    }
    
    if (gameState.quality <= 30) {
        gameState.gameResult = 'fail_quality';
        showFailScreen();
        return;
    }
}

function showFailScreen() {
    console.log('Показать экран провала:', gameState.gameResult);
    switchScreen("fail-screen");
    
    let failTitle = '', failDescription = '', failDetails = '';
    
    switch(gameState.gameResult) {
        case 'fail_budget':
            failTitle = 'BANKRUPTCY';
            failDescription = 'The project is unprofitable. The budget has been exhausted.';
            failDetails = '<h4>REASON FOR FAILURE:</h4><p>You were unable to manage your finances. Without money, the project cannot survive. Investors have left, the team has scattered, and the office was repossessed due to debt.</p>';
            break;
        case 'fail_atmosphere':
            failTitle = 'TEAM REBELLION';
            failDescription = 'The team is demoralized.';
            failDetails = '<h4>REASON FOR FAILURE:</h4><p>Silent sabotage and mass resignations began. The project is paralyzed without a motivated team. The best developers have left for competitors.</p>';
            break;
        case 'fail_quality':
            failTitle = 'EMBARRASSING FAILURE';
            failDescription = "The product is so unpolished that it's embarrassing to release it.";
            failDetails = "<h4>REASON FOR FAILURE:</h4><p>The client refused to accept it. The company's reputation has been ruined by subpar work. Bugs in the production environment led to data loss.</p>";
            break;
    }
    
    // Сохраняем данные о провале
    const failData = {
        title: failTitle,
        description: failDescription,
        details: failDetails,
        budget: gameState.budget,
        atmosphere: gameState.atmosphere,
        quality: gameState.quality,
        isFail: true
    };
    
    sessionStorage.setItem('last_game_result', JSON.stringify(failData));
    
    // Сохраняем результат в рейтинг (даже при провале)
    saveGameResultToLeaderboard();
    
    // ПОСЛЕ ПРОВАЛА ТОЖЕ ПЕРЕХОДИМ НА РЕЙТИНГ
    setTimeout(() => {
        showLeaderboard();
    }, 10000);
};


function startNewGame() {
    console.log('Начало новой игры');
    
    gameState.budget = 1000000;
    gameState.atmosphere = 75;
    gameState.quality = 80;
    gameState.currentSituation = 1;
    gameState.isGameOver = false;
    gameState.gameResult = null;
    
    updateMetricsDisplay();
    loadSituation(1);
    switchScreen('game-screen');
    console.log('Новая игра начата');
}
// ============================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================

let playerName = '';
let playerScore = 0;
let playerRank = 'AAA';

// ============================
// ФУНКЦИИ ДЛЯ РЕЙТИНГА
// ============================

async function showNameScreen() {
    console.log('Показать экран ввода имени');
    
    // Предпросчет очков (на основе текущего состояния)
    playerScore = Leaderboard.calculateScore(gameState, 'AAA');
    playerRank = document.getElementById('final-rank')?.textContent || 'AAA';
    
    // Обновляем предпросмотр
    document.getElementById('preview-score').textContent = playerScore.toLocaleString('ru-RU');
    document.getElementById('preview-rank').textContent = playerRank;
    
    // Загружаем сохраненное имя
    const savedName = localStorage.getItem('player_name');
    if (savedName) {
        document.getElementById('player-name').value = savedName;
    }
    
    switchScreen('name-screen');
    
    // Фокус на поле ввода
    setTimeout(() => {
        const input = document.getElementById('player-name');
        if (input) input.focus();
    }, 100);
}

function savePlayerNameAndStart() {
    const input = document.getElementById('player-name');
    if (!input) return;
    
    const name = input.value.trim();
    
    if (name.length === 0) {
        showNotification('Please enter your name!', 'warning');
        return;
    }
    
    if (name.length > 15) {
        showNotification('The name must not exceed 15 characters!', 'warning');
        return;
    }
    
    playerName = name;
    
    // НЕ сохраняем в localStorage - каждый раз новое имя
    console.log('Имя игрока установлено:', playerName);
    
    // Начинаем новую игру
    startNewGame();
}

async function showLeaderboard() {
    console.log('Показать таблицу рекордов');
    switchScreen('leaderboard-screen');
    
    // Показываем загрузку
    const listElement = document.getElementById('leaderboard-list');
    if (listElement) {
        listElement.innerHTML = `
            <div class="loading-scores">
                <div class="loading-spinner"></div>
                <div>Loading records...</div>
            </div>
        `;
    }
    
    // Показываем последний результат игрока, если есть
    const lastResult = sessionStorage.getItem('last_game_result');
    const lastResultElement = document.getElementById('last-result-summary');
    
    if (lastResult && lastResultElement) {
        const resultData = JSON.parse(lastResult);
        
        if (resultData.isFail) {
            // Это провал
            document.getElementById('last-score').textContent = '0';
            document.getElementById('last-rank').textContent = 'ПРОВАЛ';
            document.getElementById('last-rank').style.color = 'var(--primary-red)';
        } else {
            // Это успешное завершение
            const score = Leaderboard.calculateScore(gameState, resultData.finalRank);
            document.getElementById('last-score').textContent = score.toLocaleString('ru-RU');
            document.getElementById('last-rank').textContent = resultData.finalRank;
            document.getElementById('last-rank').style.color = 'var(--primary-yellow)';
        }
        
        lastResultElement.style.display = 'block';
    }
    
    try {
        // Загружаем статистику
        await Leaderboard.loadStats();
        
        if (Leaderboard.state.stats) {
            document.getElementById('total-players').textContent = 
                Leaderboard.state.stats.totalPlayers?.toLocaleString('ru-RU') || '0';
            document.getElementById('average-score').textContent = 
                Leaderboard.state.stats.averageScore?.toLocaleString('ru-RU') || '0';
            document.getElementById('top-score').textContent = 
                Leaderboard.state.stats.topScore?.toLocaleString('ru-RU') || '0';
        }
        
        // Загружаем рекорды
        const scores = await Leaderboard.getScores(100);
        
        if (!listElement) return;
        
        if (scores.length === 0) {
            listElement.innerHTML = `
                <div class="leaderboard-entry" style="grid-template-columns: 1fr; text-align: center; padding: 40px;">
                    <div style="color: var(--text-dim); font-family: var(--font-pixel); font-size: 12px;">
                        📭 Таблица рекордов пуста<br>
                        <small>Стань первым!</small>
                    </div>
                </div>
            `;
        } else {
            let html = '';
            
            scores.forEach((entry, index) => {
                const isCurrent = entry.name === playerName && entry.score === playerScore;
                
                html += `
                    <div class="leaderboard-entry ${isCurrent ? 'current-player' : ''}">
                        <span class="rank-number">${index + 1}</span>
                        <span class="player-name">${entry.name}</span>
                        <span class="player-score">${entry.score.toLocaleString('ru-RU')}</span>
                        <span class="player-date">${entry.date || ''}</span>
                    </div>
                `;
            });
            
            listElement.innerHTML = html;
        }
        
    } catch (error) {
        console.error('Ошибка загрузки рекордов:', error);
        listElement.innerHTML = `
            <div class="leaderboard-entry" style="grid-template-columns: 1fr; text-align: center; padding: 40px;">
                <div style="color: var(--primary-red); font-family: var(--font-pixel); font-size: 12px;">
                    ⚠️ Ошибка загрузки<br>
                    <small>Попробуйте обновить</small>
                </div>
            </div>
        `;
    }
}

async function saveGameResultToLeaderboard() {
    if (!playerName) return;
    
    // Подсчет очков
    const score = Leaderboard.calculateScore(gameState, playerRank);
    playerScore = score;
    
    const playerData = {
        name: playerName,
        score: score,
        rank: playerRank,
        budget: gameState.budget,
        atmosphere: gameState.atmosphere,
        quality: gameState.quality
    };
    
    // Сохраняем результат
    const result = await Leaderboard.saveScore(playerData);
    
    // Показываем уведомление
    if (result.success) {
        showNotification(result.message);
        
        if (result.position <= 10) {
            showNotification(`🎉 Вы в топ-${result.position}!`, 'success');
        }
    } else {
        showNotification(result.message, 'warning');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? 'rgba(0, 212, 138, 0.15)' : 'rgba(255, 210, 0, 0.15)'};
        border: 2px solid ${type === 'success' ? '#00D48A' : '#FFD200'};
        border-radius: 6px;
        font-family: 'Press Start 2P', monospace;
        font-size: 11px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 0 12px ${type === 'success' ? 'rgba(0, 212, 138, 0.5)' : 'rgba(255, 210, 0, 0.5)'};
        max-width: 300px;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function endGame() {
    console.log('Завершение игры, текущее состояние:', gameState);
    
    // ОБЯЗАТЕЛЬНО: получаем актуальные значения из DOM или gameState
    // Проверим, что gameState содержит правильные значения
    console.log('Бюджет:', gameState.budget, 'Атмосфера:', gameState.atmosphere, 'Качество:', gameState.quality);
    
    // Определяем итоговую оценку НА ОСНОВЕ ФАКТИЧЕСКИХ ЗНАЧЕНИЙ
    let budgetRank, atmosphereRank, qualityRank
    
   // Убедимся, что значения не undefined или null
    const finalBudget = gameState.budget || 0;
    const finalAtmosphere = gameState.atmosphere || 0;
    const finalQuality = gameState.quality || 0;
    
    console.log('Финальные значения для расчета:', finalBudget, finalAtmosphere, finalQuality);
    
    // Ранги для бюджета
    if (finalBudget > 600000) budgetRank = 'A';
    else if (finalBudget > 300000) budgetRank = 'B';
    else if (finalBudget > 100000) budgetRank = 'C';
    else budgetRank = 'D';
    
    // Ранги для атмосферы
    if (finalAtmosphere > 70) atmosphereRank = 'A';
    else if (finalAtmosphere > 50) atmosphereRank = 'B';
    else if (finalAtmosphere > 35) atmosphereRank = 'C';
    else atmosphereRank = 'D';
    
    // Ранги для качества
    if (finalQuality > 70) qualityRank = 'A';
    else if (finalQuality > 50) qualityRank = 'B';
    else if (finalQuality > 40) qualityRank = 'C';
    else qualityRank = 'D';
    
    const finalRank = budgetRank + atmosphereRank + qualityRank;
    console.log('Финальный ранг:', finalRank, '(', budgetRank, atmosphereRank, qualityRank, ')');
    
    // Подсчитываем количество каждого уровня
    const counts = {
        A: (finalRank.match(/A/g) || []).length,
        B: (finalRank.match(/B/g) || []).length,
        C: (finalRank.match(/C/g) || []).length,
        D: (finalRank.match(/D/g) || []).length
    };
    
    // Определяем тип комбинации
    const comboType = {
        allSame: counts.A === 3 || counts.B === 3 || counts.C === 3 || counts.D === 3,
        twoSameOneDiff: Object.values(counts).some(count => count === 2),
        allDifferent: counts.A + counts.B + counts.C + counts.D === 3 && 
                     Object.values(counts).every(count => count <= 1)
    };
    
    // Логика определения звания с учетом ВСЕХ комбинаций
    let title = "", description = "";
    
    // 1. ВСЕ МЕТРИКИ НА ОДНОМ УРОВНЕ (4 варианта)
    if (comboType.allSame) {
        if (counts.A === 3) {
            title = "LEGENDARY LEADER";
            description = "You’ve overcome every challenge and emerged unscathed! The perfect balance between budget, team, and quality. You’re respected, trusted, and emulated.";
        } else if (counts.B === 3) {
            title = "STABLE BALANCER";
            description = "Three stable Bs—the perfect middle ground! You masterfully balanced all aspects of the project, avoiding extremes. A reliable and predictable leader.";
        } else if (counts.C === 3) {
            title = "AVERAGE LEADER";
            description = "All metrics are average. The project is complete, but unremarkable. You avoided risks, but you didn’t achieve outstanding results either.";
        } else if (counts.D === 3) {
            title = "SURVIVOR";
            description = "The project is complete, but barely. All three metrics are low, but you managed to see it through to the end under extreme conditions.";
        }
    }
    // 2. ДВЕ МЕТРИКИ ОДИНАКОВЫЕ, ОДНА ДРУГАЯ (36 вариантов)
    else if (comboType.twoSameOneDiff) {
        // AAB, ABA, BAA и т.д.
        if (counts.A === 2) {
            if (counts.B === 1) {
                title = "НАДЁЖНЫЙ УПРАВЛЕНЕЦ";
                description = "Две метрики на высшем уровне, одна — на хорошем. Проект выполнен блестяще с минимальными компромиссами. Команда довольна, клиенты счастливы, начальство предлагает повышение.";
            } else if (counts.C === 1) {
                title = "ПРАГМАТИЧНЫЙ ЛИДЕР";
                description = "Две важнейшие метрики на высоте, но пришлось пожертвовать одной. Ты сделал правильный стратегический выбор, сфокусировавшись на главном.";
            } else if (counts.D === 1) {
                title = "СТРАТЕГ-ЖЕРТВОВАТЕЛЬ";
                description = "Ты сознательно принес в жертву одну метрику ради двух других. Жесткое, но эффективное решение в условиях ограниченных ресурсов.";
            }
        } else if (counts.B === 2) {
            if (counts.A === 1) {
                title = "WELL-ROUNDED SPECIALIST";
                description = "One outstanding metric and two stable ones. You've achieved an excellent result by effectively allocating your efforts and resources.";
            } else if (counts.C === 1) {
                title = "CAUTIOUS BALANCER";
                description = "Two metrics are at a good level; one requires attention. You avoided extremes, preferring stability and predictability.";
            } else if (counts.D === 1) {
                title = "RESCUER ON THE BRINK";
                description = "You kept two metrics at an acceptable level, but one spiraled out of control. The project was saved, but the cost was high.";
            }
        } else if (counts.C === 2) {
            if (counts.A === 1) {
                title = "ASYMMETRICAL TALENT";
                description = "You excelled at one key task, but the other two need improvement. A standout specialist with a narrow focus.";
            } else if (counts.B === 1) {
                title = "STABILITY CHAMPION";
                description = "One metric is at a good level; two require urgent attention. You’ve been constantly putting out fires but have maintained control.";
            } else if (counts.D === 1) {
                title = "FIREFIGHTER";
                description = "Two metrics are at a low level, and one is critical. You’ve been constantly in crisis management mode, barely keeping up with the problems.";
            }
        } else if (counts.D === 2) {
            if (counts.A === 1) {
                title = "LONE HERO";
                description = "You achieved an outstanding result on one metric, but failed on the other two. A striking, yet one-sided success.";
            } else if (counts.B === 1) {
                title = "HOLDING THE LINE";
                description = "One metric is at a good level, but two are in critical condition. You managed to hold on to at least something while everything else was falling apart.";
            } else if (counts.C === 1) {
                title = "CRISIS MANAGER";
                description = "Two metrics are in crisis, and one is barely holding on. You worked at your limit, constantly solving urgent problems.";
            }
        }
    }
    // 3. ВСЕ МЕТРИКИ РАЗНЫЕ (24 варианта)
    else if (comboType.allDifferent) {
        const ranks = [budgetRank, atmosphereRank, qualityRank];
        
        // Определяем "разброс" уровней
        const levelValues = { A: 4, B: 3, C: 2, D: 1 };
        const values = ranks.map(r => levelValues[r]);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const spread = max - min;
        
        // A-B-C combinations
        if (counts.A === 1 && counts.B === 1 && counts.C === 1) {
            title = "GRADUATED MANAGER";
            description = "Each metric is at its own level—from top to middle. You have a keen sense of priorities and skillfully balance your attention among different aspects of the project.";
        }
        // A-B-D combinations
        else if (counts.A === 1 && counts.B === 1 && counts.D === 1) {
            title = "POLARIZED LEADER";
            description = "One brilliant success, one good result, and one complete failure. You made bold decisions that led to both triumphs and disasters.";
        }
        // A-C-D combinations
        else if (counts.A === 1 && counts.C === 1 && counts.D === 1) {
            title = "RISK-TAKING STRATEGIST";
            description = "The widest range of results: from the highest achievement to a catastrophic failure. You played for high stakes, and the results turned out to be unpredictable.";
        }
        // B-C-D combinations
        else if (counts.B === 1 && counts.C === 1 && counts.D === 1) {
            title = "CHAOTIC MANAGER";
            description = "A full spectrum of results—from acceptable to catastrophic. You constantly juggled different problems, with varying degrees of success.";
        }
        // Handling extreme cases of variation
        else if (spread === 3) { // A and D in the same combination
            title = "EXTREME LEADER";
            description = "You achieved both the highest success and complete failure at the same time. Such a spread indicates extremely uneven attention to different aspects of the project.";
        } else if (spread === 2) { // 2-level difference
            title = "UNBALANCED SPECIALIST";
            description = "A significant spread between metrics indicates your tendency to focus on certain tasks at the expense of others.";
        } else if (spread === 1) { // 1-level difference
            title = "GRADUATED MANAGER";
            description = "A smooth gradient between metrics—you know how to set priorities, but you do so gradually and deliberately.";
        }
    }
    
    // 4. SPECIAL CASES (take precedence over standard logic)
    if (gameState.atmosphere <= 25 && (gameState.budget > 600000 || gameState.quality > 70)) {
        title = "DICTATOR";
        description = "The product was released, money was saved, but the team hates you. You achieved results at any cost, destroying the team’s morale. Short-term success has led to long-term problems.";
    } else if (gameState.atmosphere > 85 && (gameState.budget < 300000 || gameState.quality < 50)) {
        title = "THE LIFE OF THE COMPANY";
        description = "Everyone adores you, but the project is barely surviving and the client is dissatisfied. You’ve created a wonderful atmosphere, but you’ve forgotten about the results. Unfortunately, good relationships don’t make up for poor performance.";
    }
    
    // 5. PLACEHOLDER FOR ALL OTHER CASES
    if (!title) {
        title = "PROJECT MANAGER";
        description = "You saw the project through to the end. There’s room for improvement, but this experience is invaluable. Every future project will be better. Your result is " + finalRank;
    }
    
// Заполняем экран победы - используем актуальные значения
    const finalRankElement = document.getElementById('final-rank');
    const resultTitleElement = document.getElementById('result-player-title');
    const resultDescriptionElement = document.getElementById('result-description');
    const finalBudgetElement = document.getElementById('final-budget');
    const finalAtmosphereElement = document.getElementById('final-atmosphere');
    const finalQualityElement = document.getElementById('final-quality');
    
    if (finalRankElement) finalRankElement.textContent = finalRank;
    if (finalRankElement) finalRankElement.textContent = finalRank;
    if (resultTitleElement) resultTitleElement.textContent = title;
    if (resultDescriptionElement) resultDescriptionElement.textContent = description;
    if (finalBudgetElement) finalBudgetElement.textContent = `${gameState.budget.toLocaleString('ru-RU')} ₽`;
    if (finalAtmosphereElement) finalAtmosphereElement.textContent = gameState.atmosphere + '%';
    if (finalQualityElement) finalQualityElement.textContent = gameState.quality + '%';
    
    // Отображаем детализацию уровней
    const rankDetailsElement = document.getElementById('rank-details');
    if (rankDetailsElement) {
        rankDetailsElement.innerHTML = `
            <div class="rank-detail">
                <span class="metric-name">Бюджет:</span>
                <span class="metric-rank rank-${budgetRank.toLowerCase()}">${budgetRank}</span>
            </div>
            <div class="rank-detail">
                <span class="metric-name">Атмосфера:</span>
                <span class="metric-rank rank-${atmosphereRank.toLowerCase()}">${atmosphereRank}</span>
            </div>
            <div class="rank-detail">
                <span class="metric-name">Качество:</span>
                <span class="metric-rank rank-${qualityRank.toLowerCase()}">${qualityRank}</span>
            </div>
        `;
    }
    
    switchScreen('win-screen');
    console.log('Игра завершена, итоговый ранг:', finalRank, 'Звание:', title);
    
    // Сохраняем финальные данные
    const finalData = {
        name: playerName,
        score: playerScore,
        title: title,
        description: description,
        finalRank: finalRank,
        budget: gameState.budget,
        atmosphere: gameState.atmosphere,
        quality: gameState.quality
    };
    
    // Временно сохраняем в sessionStorage для показа на экране рейтинга
    sessionStorage.setItem('last_game_result', JSON.stringify(finalData));
    
    // Сохраняем результат в рейтинг
    saveGameResultToLeaderboard();
    switchScreen('win-screen');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbytP8fmRHQ-ZcGEZz4RxD-K_UupnHoECMzt7Pm2dZHNHj02EmkwGIXIJGDdwPijLRY/exec';

    try {
    const response = fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(finalData)
    });

    console.log('Данные успешно отправлены!');
  } catch (error) {
    console.error('Ошибка при отправке:', error);
  }

    // ПОСЛЕ СОХРАНЕНИЯ РЕЗУЛЬТАТА, ПЕРЕХОДИМ НА ЭКРАН РЕЙТИНГА
    setTimeout(() => {
        showLeaderboard();
    }, 10000);
    
    console.log('Игра завершена, итоговый ранг:', finalRank);
}

// Обновите DOMContentLoaded:
// ============================
// ИНИЦИАЛИЗАЦИЯ И НОВАЯ ЛОГИКА ЗАПУСКА
// ============================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM загружен, инициализация игры...');
    
    // Инициализируем пиксельный курсор
    initPixelCursor();
    
    // Инициализируем систему рейтинга
    await Leaderboard.init();
    
    // НЕ загружаем сохраненное имя - каждый раз новый игрок
    // Сбрасываем имя игрока
    playerName = '';
    playerScore = 0;
    playerRank = 'AAA';
    
    // Инициализация метрик
    updateMetricsDisplay();
    
    // ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ СТАРТОВОГО ЭКРАНА
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('Нажата кнопка "Начать игру"');
            showNameScreen(); // Всегда показываем экран ввода имени
        });
    }
    
    // ОБРАБОТЧИК ДЛЯ СОХРАНЕНИЯ ИМЕНИ И НАЧАЛА ИГРЫ
    const saveNameBtn = document.getElementById('save-name-btn');
    if (saveNameBtn) {
        saveNameBtn.addEventListener('click', savePlayerNameAndStart);
    }
    
    // ОБРАБОТЧИК ДЛЯ ВВОДА ИМЕНИ ПО НАЖАТИЮ ENTER
    const playerNameInput = document.getElementById('player-name');
    if (playerNameInput) {
        playerNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                savePlayerNameAndStart();
            }
        });
    }
    
    // ОБРАБОТЧИКИ ДЛЯ КНОПОК ВОЗВРАТА В МЕНЮ
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    if (backToMenuBtn) {
        backToMenuBtn.addEventListener('click', () => {
            switchScreen('start-screen');
        });
    }
    
    const backToMenuLb = document.getElementById('back-to-menu-lb');
    if (backToMenuLb) {
        backToMenuLb.addEventListener('click', () => {
            switchScreen('start-screen');
        });
    }
    
    const menuFromFailBtn = document.getElementById('menu-from-fail-btn');
    if (menuFromFailBtn) {
        menuFromFailBtn.addEventListener('click', () => {
            switchScreen('start-screen');
        });
    }
    
    // ОБРАБОТЧИКИ ДЛЯ ИГРОВОГО ПРОЦЕССА
    const nextSituationBtn = document.getElementById('next-situation-btn');
    if (nextSituationBtn) {
        nextSituationBtn.addEventListener('click', nextSituation);
    }
    
    const refreshLeaderboardBtn = document.getElementById('refresh-leaderboard');
    if (refreshLeaderboardBtn) {
        refreshLeaderboardBtn.addEventListener('click', showLeaderboard);
    }
    
    // ОБРАБОТЧИКИ ДЛЯ НОВОЙ ИГРЫ (после завершения)
    const playAgainBtn = document.getElementById('play-again-btn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            // Всегда начинаем с ввода имени
            playerName = '';
            showNameScreen();
        });
    }
    
    const restartFailBtn = document.getElementById('restart-fail-btn');
    if (restartFailBtn) {
        restartFailBtn.addEventListener('click', () => {
            // Всегда начинаем с ввода имени
            playerName = '';
            showNameScreen();
        });
    }
    
    const playAgainLeaderboardBtn = document.getElementById('play-again-leaderboard');
    if (playAgainLeaderboardBtn) {
        playAgainLeaderboardBtn.addEventListener('click', () => {
            // Всегда начинаем с ввода имени
            playerName = '';
            showNameScreen();
        });
    }
    
    // ОБРАБОТЧИК ДЛЯ КНОПКИ "РЕЙТИНГ" НА СТАРТОВОМ ЭКРАНЕ
    const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
    if (showLeaderboardBtn) {
        showLeaderboardBtn.addEventListener('click', showLeaderboard);
    }
    
    // ПОКАЗЫВАЕМ СТАРТОВЫЙ ЭКРАН
    switchScreen('start-screen');
    console.log('Игра инициализирована, стартовый экран показан');
});
