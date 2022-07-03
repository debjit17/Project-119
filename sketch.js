quick_draw_data_set = ["aircraft carrier","airplane","alarm clock","ambulance","angel","animal migration","ant","anvil","apple","arm","asparagus","axe","backpack","banana","bandage","barn","baseball","baseball bat","basket","basketball","bat","bathtub","beach","bear","beard","bed","bee","belt","bench","bicycle","binoculars","bird","birthday cake","blackberry","blueberry","book","boomerang","bottlecap","bowtie","bracelet","brain","bread","bridge","broccoli","broom","bucket","bulldozer","bus","bush","butterfly","cactus","cake","calculator","calendar","camel","camera","camouflage","campfire","candle","cannon","canoe","car","carrot","castle","cat","ceiling fan","cello","cell phone","chair","chandelier","church","circle","clarinet","clock","cloud","coffee cup","compass","computer","cookie","cooler","couch","cow","crab","crayon","crocodile","crown","cruise ship","cup","diamond","dishwasher","diving board","dog","dolphin","donut","door","dragon","dresser","drill","drums","duck","dumbbell","ear", "elbow","elephant","envelope","eraser","eye","eyeglasses","face","fan","feather","fence","finger","fire hydrant","fireplace","firetruck","fish","flamingo","flashlight","flip flops","floor lamp","flower","flying saucer","foot","fork","frog","frying pan","garden","garden hose","giraffe","goatee","golf club","grapes","grass","guitar","hamburger","hammer","hand","harp","hat","headphones","hedgehog","helicopter","helmet","hexagon","hockey puck","hockey stick","horse","hospital","hot air balloon","hot dog","hot tub","hourglass","house","house plant","hurricane","ice cream","jacket","jail","kangaroo","key","keyboard","knee","knife","ladder","lantern","laptop","leaf","leg","light bulb","lighter","lighthouse","lightning","line","lion","lipstick","lobster","lollipop","mailbox","map","marker","matches","megaphone","mermaid","microphone","microwave","monkey","moon","mosquito","motorbike","mountain","mouse","moustache","mouth","mug","mushroom","nail","necklace","nose","ocean","octagon","octopus","onion","oven","owl","paintbrush","paint can","palm tree","panda","pants","paper clip","parachute","parrot","passport","peanut","pear","peas","pencil","penguin","piano","pickup truck","picture frame","pig","pillow","pineapple","pizza","pliers","police car","pond","pool","popsicle","postcard","potato","power outlet","purse","rabbit","raccoon","radio","rain","rainbow","rake","remote control","rhinoceros","rifle","river","roller coaster","rollerskates","sailboat","sandwich","saw","saxophone","school bus","scissors","scorpion","screwdriver","sea turtle","see saw","shark","sheep","shoe","shorts","shovel","sink","skateboard","skull","skyscraper","sleeping bag","smiley face","snail","snake","snorkel","snowflake","snowman","soccer ball","sock","speedboat","spider","spoon","spreadsheet","square","squiggle","squirrel","stairs","star","steak","stereo","stethoscope","stitches","stop sign","stove","strawberry","streetlight","string bean","submarine","suitcase","sun","swan","sweater","swingset","sword","syringe","table","teapot","teddy-bear","telephone","television","tennis racquet","tent","The Eiffel Tower","The Great Wall of China","The Mona Lisa","tiger","toaster","toe","toilet","tooth","toothbrush","toothpaste","tornado","tractor","traffic light","train","tree","triangle","trombone","truck","trumpet","tshirt","umbrella","underwear","van","vase","violin","washing machine","watermelon","waterslide","whale","wheel","windmill","wine bottle","wine glass","wristwatch","yoga","zebra","zigzag"]

random_number = Math.floor(( Math.random() * quick_draw_data_set.length ) + 1);

RandomDrawTo = quick_draw_data_set[random_number];
RandomDrawTo = RandomDrawTo[0].toUpperCase() + RandomDrawTo.substring(1);

document.getElementById('toDraw').innerHTML = "Sketch To Draw: " + RandomDrawTo;

var timer_check = false;
var sketchDrawn = "";
var distance = 0;
var limit = 1;
var x;

score = 0;

document.getElementById("score").innerHTML = "Score: " + score;

function preload()
{
    classifier = ml5.imageClassifier('DoodleNet');
}

function setup()
{
    canvas = createCanvas(280, 280);
    Timer();

    x = (windowWidth - width) / 2;;
    y = (windowHeight - height) / 2;
    y = y + 100;
    canvas.position(x, y);

    background("white");
    canvas.mouseReleased(classifyCanvas);
    synth = window.speechSynthesis;
}

function draw()
{
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    console.log("Timer: " + minutes + ":" + seconds)
    strokeWeight(13);
    stroke(0);
    if(mouseIsPressed)
    {
        line(pmouseX, pmouseY, mouseX, mouseY);
    }
}

function classifyCanvas()
{
    synth.cancel();
    classifier.classify(canvas, gotResult);
}

function gotResult(error, results)
{
    if(error)
    {
        console.log(error);
    }
    if(results)
    {
        document.getElementById('label').innerHTML = "Your Sketch: " + results[0].label;
        document.getElementById('confidence').innerHTML = "Confidence: " + Math.round(results[0].confidence * 100) + "%";

        sketchDrawn = results[0].label;
        check_sketch(sketchDrawn);

        utterThis = new SpeechSynthesisUtterance(results[0].label);
        synth.speak(utterThis);
    }
    else
    {
        document.getElementById('label').innerHTML = "Not Trained";

        utterThis = new SpeechSynthesisUtterance("I am not trained for this");
        synth.speak(utterThis)
    }
}

function check_sketch(sketch)
{
    if(RandomDrawTo.toLowerCase() == sketchDrawn.toLowerCase())
    {
        updateCanvas();
        document.getElementById("p").innerHTML = "You Won";
        utterThis = new SpeechSynthesisUtterance("You Won");
        synth.speak(utterThis)
        document.getElementById("p").style = "animation-name: TimeUp;"
        clearInterval(x);
        distance = 0;
        const myTimeout = setTimeout(Timer, 1000);
        score++;
        document.getElementById("score").innerHTML = "Score: " + score;
    }
    else if(sketch == "null")
    {
        updateCanvas();
        distance = 0;
        document.getElementById("p").innerHTML = "Time's Up";
        utterThis = new SpeechSynthesisUtterance("Time's Up");
        synth.speak(utterThis)
        document.getElementById("p").style = "animation-name: TimeUp;"
        const myTimeout = setTimeout(Timer, 1000);
    }
}

function clearCanvas()
{
    background('white');
}

function Timer()
{
    document.getElementById("p").style = "animation-name: ;";

    x = setInterval(function() {
    console.log("Timering")
    distance = distance + 1000;
    
    var minutes = Math.floor(distance % ((1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor(distance % ((1000 * 60)) / 1000/* % distance*/);

    document.getElementById("timer").innerHTML = "Timer: " + minutes + ":" + seconds;
        
    if (distance > limit * 60000) {
        clearInterval(x);
        document.getElementById("timer").innerHTML = "Time Up";
        check_sketch("null");
    }
    }, 1000);
}

function updateCanvas()
{
    background('white');
    document.getElementById('label').innerHTML = "Your Sketch: ";
    document.getElementById('confidence').innerHTML = "Confidence: ";
    random_number = Math.floor(( Math.random() * quick_draw_data_set.length ) + 1);
    RandomDrawTo = quick_draw_data_set[random_number]
    document.getElementById('toDraw').innerHTML = "Sketch To Draw: " + RandomDrawTo;
}
