window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let header = $("#header");
    let intro = $("#intro");
    let introHeight;
    let scrollPosition;

    /* Fixed Header
     * ====================================================*/
    $(window).on("scroll load resize", function () {
        introHeight = intro.innerHeight();
        scrollPosition = $(this).scrollTop();

        if (scrollPosition > introHeight) {
            header.addClass('fixed fadeInDown animated');
        } else {
            header.removeClass('fixed fadeInDown');
        }
    });


    /*Smooth Scroll
    * =====================================================*/
    let pageUp = $(".pageup");
    let $page = $('html, body');


    //Показ/скрытие pageUp
    $(window).on("scroll load resize", function () {
        scrollPosition = $(this).scrollTop();
        if (scrollPosition > 1300) {
            pageUp.addClass('fadeIn animated');
            pageUp.removeClass('fadeOut');
        } else {
            pageUp.addClass('fadeOut');
            pageUp.removeClass('fadeIn');
        }
    });


    //Анимированный плавный скрол
    $('a[href^="#"]').on("click", function () {
        $page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 1000);
        return false;
    });


    /*Tabs
    * =====================================================*/
    $('.projects-nav').on("click", ".tab-nav", function () {
        let tabsNav = $(".tab-nav"),
            tabsContent = $(".tab-content");
        tabsNav.removeClass("active");
        tabsContent.removeClass("active fadeIn");
        $(this).addClass("active");
        tabsContent.eq($(this).index()).addClass("active animated fadeIn");
        tabsContent.eq($(this).index()).slick("setPosition");
        return false;
    });


    /*Projects Slider
    * =========================================*/
    $('.projects__slider').slick({
        autoplay: 5000,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },

            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });


    /*Design Slider
    * =========================================*/
    $('.design__list').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },

            {
                breakpoint: 420,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });


    /*Answers
    =========================================*/
    let asks = $('.asks__item');
    asks.each(function () {

        $(this).on('click', function (e) {
            e.preventDefault();
            let answer = $(this).find('.answer');
            answer.addClass('show');
        });

        $(this).on('click', '.answer__close-icon', function (event) {
            event.stopPropagation();
            $(this).closest('.answer').removeClass('show');
        });
    });


    /*Forms
    * =======================================*/
    const forms = () => {

        let form = document.querySelectorAll('form'),
            inputs = document.querySelectorAll('input');

        //Блок ответа
        let answerBlock = document.createElement('div');
        answerBlock.classList.add('popup__answer');


        //Ответы для клиента
        let message = {
            loading: 'Загрузка...',
            success: 'Спасибо за Ваше обращение! Мы свяжемся с Вами в течении 15 минут.',
            fail: 'Извините! Что-то пошло не так...',
            loadingImg: './img/answer-loading.gif',
            successImg: './img/answer-success.png'
        };

        form.forEach((item) => {

            item.addEventListener('submit', function (event) {
                event.preventDefault();

                //Создаем блок показа ответа
                document.body.append(answerBlock);

                let answerImg = document.createElement('img');
                answerImg.setAttribute('src', message.loadingImg);
                answerBlock.append(answerImg);

                let answerText = document.createElement('p');
                answerBlock.append(answerText);
                answerText.innerHTML = message.loading;

                //Функция удаления блока
                function delAnswer() {
                    setTimeout(function () {
                        answerBlock.remove();
                        answerImg.remove()
                        ;answerText.remove()
                    }, 4000);
                }

                //Запрос
                let request = new XMLHttpRequest();
                request.open('POST', 'server.php');
                request.setRequestHeader('Content-type', 'application/json; charset=utf-8');

                let formData = new FormData(item);

                //Преобразование полученных данных в JSON
                let obj = {};
                formData.forEach(function (value, key) {
                    obj[key] = value;
                });
                let json = JSON.stringify(obj);

                request.send(json);

                request.addEventListener('readystatechange', function () {
                    if (request.readyState === 4 && request.status === 200) {
                        answerImg.setAttribute('src', message.successImg);
                        answerText.innerHTML = message.success;
                        delAnswer();
                    } else {
                        answerText.innerHTML = message.fail;
                        delAnswer();
                    }
                });

                //Очистка полей после запроса
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].value = '';
                }
            });
        });

    };
    forms();

});