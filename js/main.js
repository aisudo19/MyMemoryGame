(function(){
    'use strict';
    
    var pairs= 2;
    var cards = [];
    
    var flipCount = 0;// カードを何回めくったかを覚えておく変数
    var firstCard = null;// 1 番目にめくったカード
    var secondCard = null;//2 番目にめくったカード
    
    var startTime;
    var isRunning = false;
    var correctCount= 0;// 全てのペアが揃ったらタイマーが止まるようにペア数を数える
    var timeoutId;
    
    function init() {
        var i;
        var card;
        for(i = 1; i <= pairs; i++) {
            cards.push(createCard(i));
            cards.push(createCard(i));
            //document.getElementById('stage').appendChild(createCard(i));
            //document.getElementById('stage').appendChild(createCard(i));
        }
        while (cards.length) {
            card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
            document.getElementById('stage').appendChild(card);
        }
    }
    
    function createCard(num){
        var container;
        var card;
        var inner;
        inner = '<div class="card-front">' + num + '</div><div class="card-back">?</div>';
        card = document.createElement('div');
        card.innerHTML = inner;
        card.className = 'card';
        card.addEventListener('click', function() {
            //card.className="card open";
            flipCard(this);// card がthisに入る
            if(isRunning === true){
                return;
            }
            isRunning = true;
            startTime = Date.now();
            runTimer();
            document.getElementById('restart').className = '';
        })
        container = document.createElement('div');
        container.className='card-container';
        container.appendChild(card);
        return container;
    }
    
    function flipCard(card) {
        if(firstCard !== null && secondCard !== null) {
            return;
        }
        
        if(card.className.indexOf('open') !== -1){// 同じカードを2回続けてクリックしたときに2枚目がめくれなくなるのを防ぐため、カードのクラスがopenになっていないか調べる
            return;
        }
        
        card.className='card open';
        flipCount++;
           
        if(flipCount % 2 === 1){// 1枚目のカードである！
            firstCard = card;
        }
        else {　// 2枚目のカードである！
            secondCard = card;
            //check();// ここで正誤判定
            secondCard.addEventListener('transitionend', check);
        }
    }
    
    function check() {// カードを見比べて、中の数値が合っていれば開いたままにしつつ、数値が違っていた時だけカードを閉じれば OK 
        // firstCard の 0 番目の子要素の textContent が 2 番目のそれと違っていたら
        if(firstCard.children[0].textContent !== secondCard.children[0].textContent){
            //同じ場合は開いたままでいいのですが、違った場合はカードを閉じたい
            firstCard.className = 'card';
            secondCard.className = 'card';
        }else{
            correctCount++;
            if(correctCount === pairs) {
                clearTimeout(timeoutId);//タイマーを止める
            }
        }
        // 正誤判定が終わったら flipCard がまた動作するように、 firstCard も secondCard も null に戻す
        secondCard.removeEventListener('transitionend', check)
        firstCard = null;
        secondCard = null;
    }
    
    function runTimer() {
        document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2); //ミリ秒なので秒に直す 小数点以下 2 桁までの表示に
        timeoutId = setTimeout(function() {
            runTimer();
        }, 10);
    }
    init();
    
})();