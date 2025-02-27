//создаем переменную и инициализируем в ней работу Vue(внутри скобок передаем обьект {} в котором будут храниться все параметры для Vue)
let app = new Vue({
    el: '.main',//элемент - указываем селектор, который будет являться главным элементом ( в нашем случае это будет div с классом main)
    data: /* тут создадим логические переменные с помощью которых сможем отображать наши экраны (так как showMain в значении true - то по умолчанию будет отображаться главный экран, а экран с соц. сетями(showSocial) будет скрыт)*/{
        showMain: true, 
        showSocial: false,
        showAchivment: false,
        showQuestions: false,
        showResults: false,
        number: 0, //переменная, отвечающая за номер вопроса
        score: {
            'shrek': 0,
            'fiona':0,
            'prynia':0,
            'osel':0,
            'cat':0,
            'lord':0,
            'drakon':0,
        },
        totalGame /* колво игр за каждого персонажа которое будет отображаться на странице с достижениями */: localStorage.getItem('sc2TotalGame') ? JSON.parse(localStorage.getItem('sc2TotalGame')) : {
            'shrek': 0,
            'fiona':0,
            'prynia':0,
            'osel':0,
            'cat':0,
            'lord':0,
            'drakon':0,
        },
        totalGames /* общее колво сыгранных игр */: localStorage.getItem('sc2TotalGames') ? localStorage.getItem('sc2TotalGames') : 0,//если в локальном хранилище нет заданной переменной, то будет устанавливаться 0, если же есть, то с помощью getItem будем отображать это число
        questions: questions, /* взяли константу question из файлы const.js и так как у нас подключен файл const.js то никаких проблем не будет и константа будет найдена */
        results: results, /* константа из файла const.js */
        resultRace: 'shrek',
    }, //передаем тут любые данные
    /* МЕТОДЫ - ФУНКЦИИ */
    methods: {
        /* метод, который будет перенаправлять нас на главную страницу с любой другой (кнопка назад)*/
        goToMain() {
            this.showMain = true // this - указывает что переменная после точки является переменной внутри нашего элемента
            this.showSocial = false //отключаем отображение всех страниц кроме Main
            this.showAchivment = false
            this.showQuestions = false
            this.showResults = false
        },

        /* метод, который будет перенаправлять нас на страницу соц.сетей*/
        goToSocial() {
            this.showMain = false
            this.showSocial = true
            this.showAchivment = false
            this.showQuestions = false
            this.showResults = false
        },

        /* метод, который будет перенаправлять нас на страницу достижений, но только в том случае если уже была сыграна хоть 1 игра*/
        goToAchivment() {
            if(this.totalGames > 0) {
                this.showMain = false
                this.showSocial = false
                this.showAchivment = true
                this.showQuestions = false
                this.showResults = false
            } else {
                this.goToQuestion() //вызываем метод, который будет направлять на страницу с вопросами
            }
        },

        /* метод, который будет направлять на страницу с вопросами */
        goToQuestion(){
            /* сброс всех переменных к 0 в начале каждой игры */
            this.score = {
                'shrek': 0,
                'fiona':0,
                'prynia':0,
                'osel':0,
                'cat':0,
                'lord':0,
                'drakon':0,
            },
            this.showMain = false
            this.showSocial = false
            this.showAchivment = false
            this.showQuestions = true
            this.showResults = false
        },

        /* метод, который будет направлять на страницу с результатами и отображать его*/
        goToResults(race) {
            this.showMain = false
            this.showSocial = false
            this.showAchivment = false
            this.showQuestions = false
            this.showResults = true
            this.resultRace = race

            if (race === 'none'){
                this.resultText = "Вы не похожи ни на кого из вселенной Шрека :(("
            } else {
                this.resultText = `Вы - ${results.name}`
            }
        },

        /* метод для переключения вопроса */
        nextQuestions(answer) {
            if(this.number == 6) /* если индекс вопроса = 6(последний вопрос), то мы значение вопроса сбрасываем до 0 чтобы новая игра началась с первого вопроса */{
                this.number = 0
                this.endGame()
            } else /* если вопрос не последний, то будет выполняться переключение на следующий вопрос */ {
                this.number++ //увеличиваем значение вопроса на 1
            }
            eval(answer) //выполняется код из файлы const.js с подсчетом очков за каждого персонажа
        },

        /* метод для расчета результата игры и того финала, на который выходит игрок */
        endGame () {
            this.totalGames++;
            localStorage.setItem('sc2TotalGames', this.totalGames)
            
            //определяем максимальное колво очков
            let maxScore = Math.max (
                this.score.shrek, this.score.osel, this.score.lord, this.score.fiona, this.score.cat, this.score.drakon, this.score.prynia
            );

            //фильтруем персонажей и находим у кого максимум очков
            let possibleResults = Object.keys(this.score).filter(
                key => this.score[key] >= 4 && this.score[key] === maxScore
            );

            //выбираем случайного персонажа если у кого-то равное колво баллов
            if ( possibleResults.length > 0) {
                let randomResult = possibleResults[Math.floor(Math.random()* possibleResults.length)]
                this.goToResults(randomResult)
                this.totalGame[randomResult]++
            } else {
                this.goToResults('none')
            }
            console.log ('Saving totalGame to localStorage:', this.totalGame)
            localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
            } 
        },

        /* СВОЙСТВА - вычисляются только в том случае, если происходит изменение в одном из свойств, создается так же как метод, но обязательно должно возвращать хотя бы 1 значение*/

        computed: {

            /* общий счет игры */
            totalScore() {
                let score = 0 
                for (let i in this.totalGame) {
                    score += (this.totalGame[i]*results[i].points)
                }
                return score
            },

            /* проверка открытых персонажей */
            openCharacters() {
                let count = 0 
                for (let i in this.totalGame) {
                    if(this.totalGame[i]>0) count++
                }
                return count
            },

            /* если персонаж еще ни разу не попадался то он не будет отображаться в достижениях */
            showResultRace() {
                return {
                    'shrek': this.totalGame.shrek > 0 ? true : false,
                    'fiona': this.totalGame.fiona > 0 ? true : false,
                    'cat': this.totalGame.cat > 0 ? true : false,
                    'osel': this.totalGame.osel > 0 ? true : false,
                    'lord': this.totalGame.lord > 0 ? true : false,
                    'drakon': this.totalGame.drakon > 0 ? true : false,
                    'prynia': this.totalGame.prynia > 0 ? true : false,

                }
            },

            /* любимый персонаж */
            favCharacter() {
                let max = 'fiona'
                for (let i in this.totalGame) {
                    if (this.totalGame[i]>this.totalGame[max]) {
                        max = i
                    }
                }
                return results[max].name
            }

        },
    })

    let audio = new Audio('audio/09_-smash-mouth-all-star.mp3')
    let audio_btn = document.querySelector('.btn__sound')
    let audio_icon = document.querySelector('.btn__sound i')

    audio.muted = true ; //по умолчанию звук будет отключен
    audio.autoplay = true ;
    audio.volume = 0.2 ;

    audio.addEventListener('loadmetadata', function(){
        audio.currentTime = 0;
    })

    audio_btn.addEventListener('click', function() {
        if (audio.muted) /* если звук выключен то мы должны его включить и поменять класс у иконки */{
            audio.muted = false;
            audio_icon.classList.add('fa-volume-up') //добавляем класс иконки включенного звука
            audio_icon.classList.remove('fa-volume-off') //удаляем класс иконки выключенного звука
        } else if (!audio.muted) /* если звук включен то мы должны его выключить и поменять класс у иконки */{
            audio.muted = true;
            audio_icon.classList.remove('fa-volume-up') 
            audio_icon.classList.add('fa-volume-off')
        }
    })