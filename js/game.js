class Game{
    constructor(){
        this.botao = createButton("");
    }
    posicionar(){
        this.botao.position(width*0.66,100);
        //define o estilo e a imagem do botão
        this.botao.class("resetButton");
        
        //define o que ocorre quando clica nele
        this.botao.mousePressed(()=>{
            //indica a raiz do banco de dados
            database.ref("/").set({
                //escreve esses valores no banco
                gameState:0, playerCount:0
            });
            //recarrega a página local
            window.location.reload();
        });
    }



    
    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        //pega a quantidade de jogadores no bd
        player.getCount();

        //cria a sprite do carro1
        car1 = createSprite(width/2 - 100, height-100);
        car1.addImage("carro", carimg1);
        car1.scale = 0.07;

        //cria a sprite do carro2
        car2 = createSprite(width/2 + 100, height-100);
        car2.addImage("carro", carimg2);
        car2.scale = 0.07;

        //adiciona as duas sprites na matriz cars
        cars = [car1, car2];

        //definir os grupos....
        coins = new Group();
        fuels = new Group();

        //criando as sprites...
        this.addSprites(coins, coinImg, 35, 0.5);
        this.addSprites(fuels, fuelImg, 20, 0.02);

    }
    coletarMoeda(i){
        cars[i-1].overlap(coins, function(coletor, collected){
            collected.remove();
        });
    }
    coletarComb(i){
        cars[i-1].overlap(fuels, function(coletor, collected){
            collected.remove();
        });
    }

    addSprites(grupo, imagem, numero, tamanho){
        
        for(var i = 0; i < numero; i++){
           var x = random(width*0.33, width*0.666); 
           var y = random(-height*4, height-100);
           
           //cria a sprite
           var sprite = createSprite(x,y);
           //adiciona a imagem na sprite
           sprite.addImage(imagem);
           sprite.scale = tamanho;
           grupo.add(sprite);
        }

    }



    play(){
        form.esconder();
        Player.getInfo();
        this.posicionar();
        //checar se allPlayers tem valor
        if(allPlayers !== undefined){

            //colocar a imagem da pista
            image (pista, 0, -height*5 , width, height*6);
            
            //guardar o indice da sprite do carro
            var i = 0;
            //repetir os códigos pelo número de props do objeto
            for(var plr in allPlayers){
                //guarda do banco de dados o valor x
                var x = allPlayers[plr].posX;
                //guarda do banco de dados o valor y
                var y = height - allPlayers[plr].posY;
                //muda a posição da sprite do carro
                cars[i].position.x = x;
                cars[i].position.y = y;
                //aumenta o i para posicionar o outro carro
                i++;
                //checa se o valor de i é igual ao índice do jogador
                if( i == player.indice ){
                    //pinta de vermelho
                    fill("red");
                    //desenha uma bola vermelha
                    ellipse(x,y,60);
                    //a câmera segue o jogador
                    camera.position.y = y;
                    //detecta a colisão entre o carro e a moeda
                    this.coletarMoeda(i);
                    //NÃO TRAPACEIEM NO DESAFIO >:(
                    this.coletarComb(i);
                }

            }
            //chamar o método controlar carro
            this.controlarCarro();
            //desenhar as sprites
            drawSprites();
        }
    }

    controlarCarro(){
        if(keyDown(UP_ARROW)){
            player.posicaoY += 10;
            player.update();
        }
        if(keyDown(LEFT_ARROW) && player.posicaoX > width*0.33){
            player.posicaoX -= 10;
            player.update();
        }
        if(keyDown(RIGHT_ARROW) && player.posicaoX < width*0.66){
            player.posicaoX += 10;
            player.update();
        }
    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state
        })
    }
    

}