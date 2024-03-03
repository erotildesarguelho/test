const video = document.getElementById('video')

console.log("Iniciou captura")

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('models'),
  faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

let previousLandmarks;
const ativaViva = false;
const controleTempo = false;
const contadorTempo = [];
var contaSegundos = 0
const divtempo = document.getElementById('tempo');
const divTitulo1= document.getElementById('titulo-1');
const divTitulo2 = document.getElementById('titulo-2');
var faceMold = document.getElementById('faceMold');




const devBt_capture = document.getElementById('bt_capture'); // Substitua 'bt_enviar' pelo ID real do seu botão


video.addEventListener('play', () => {


  
  

  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    //Metodo para Converter captura em base64 e Consulta API de Reconhecimento facial
    if (detections){


      try {
    
        // Itera sobre as detecções para obter expressões faciais
        detections.forEach(detection => {

          const expressions = detection.expressions;
          //surprised neutral
         

          const numeroFormatado = Number(expressions.surprised.toFixed(2));
          console.log("Expressões Faciais:", numeroFormatado);

          
    
  
          if(expressions.surprised > 0.90 && contaSegundos < 3){
            
            contaSegundos++

            console.log("Tempo: ", contaSegundos)
            divtempo.style.display = 'inline';
            divtempo.style.fontSize ='20px';
            divtempo.style.display = 'flex';
            divtempo.style.justifyContent = 'center';
            divtempo.style.alignItems = 'center';




            // Limpa o conteúdo atual e adiciona o novo conteúdo
            if (contaSegundos == 1){
              divtempo.innerHTML = `Vamos lá, repetir o movimento`
            }
            if (contaSegundos == 2){
              divtempo.innerHTML = `Esta quase lá, só mais uma vez!`
            }
            //divtempo.innerHTML = contaSegundos;
          }

          if(expressions.surprised < 0.20 && contaSegundos < 3){
            
            console.log("Chamar API reconhecimneto Facial")

          }

          if (contaSegundos >= 3){

            divtempo.style.display = 'none';
            //divTitulo1.style.display = 'none';
            divTitulo2.style.display = 'none';
            
            divTitulo1.innerHTML = 'Validado com sucecsso, para finalizar seu cadastro, clique no botão verde!'
            divTitulo1.style.color = 'green'
            //devBt_capture.display = 'inline'
            devBt_capture.innerHTML = '<button class="btn btn-primary mt-3 rounded-circle" id="bt_enviar"  onclick="capturarFace()"></button>'
            
            faceMold.classList.add('fill-animation');
            
          }

          

        

            // Verifica movimento facial
            if (previousLandmarks) {
              const currentLandmarks = detection.landmarks._positions;
              const movementThreshold = 5; // Ajuste conforme necessário
  
              const hasMovement = currentLandmarks.some((point, index) => {
                const prevPoint = previousLandmarks[index];
                return Math.abs(point._x - prevPoint._x) > movementThreshold ||
                       Math.abs(point._y - prevPoint._y) > movementThreshold;
              });
  
              console.log("Movimento Facial:", hasMovement ? "Detectado" : "Não Detectado");
            }

            // Atualiza landmarks anteriores
          previousLandmarks = detection.landmarks._positions.slice();

        });



      } catch (error) {
      }




  
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  
      // desenha as caixas delimitadoras e textos para cada face detectada
      // resizedDetections.forEach(detection => {
      //   const boxWithText = { box: detection.detection.box, text: 'Face' }
      //   const drawOptions = { lineWidth: 2, boxColor: '#00ff00', textColor: '#00ff00' }
      //   faceapi.draw.drawBoxWithText(canvas, boxWithText, drawOptions)
      // })
  
  
      //faceapi.draw.drawDetections(canvas, resizedDetections)
      //faceapi.draw.drawFaceExpressions(canvas, resizedDetections) //Mostra Expessões


    }
   

  }, 1000)
})

async function extractFaceFromBox(imageRef, box) {

  const appRequest = config.paginaRequest();

  var name = "Não identificado"

  const regionsToExtract = [
    new faceapi.Rect(box.x, box.y, box.width, box.height)
  ];
  let faceImages = await faceapi.extractFaces(imageRef, regionsToExtract);

  if (faceImages.length === 0) {
    console.log("No face found");
  } else {
    const outputImage = "";
    faceImages.forEach((cnv) => {
      outputImage.src = cnv.toDataURL();

      //Converte imagen cortada em base64
      const outputImage2 = document.createElement("img");
      outputImage2.src = faceImages[0].toDataURL('image/jpg');
      const base64Image = outputImage2.src.split(',')[1];
      
      //console.log(base64Image);
      //Retornar nome idenficado
      if (localStorage.getItem('faceRequest') == 0 ){

        localStorage.setItem('faceRequest',1)
         
        retoroAPi = face_recogntion(base64Image,appRequest);
        console.log("Enviou para API Base64")
      }
      


      name = "Nome Identi"

      

    }
    );

    return name

  }
}


async function face_recogntion(imgBase64,appRequest) {


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var cod_pessoa = ""

  
  if(appRequest.cod_pessoa !== undefined){
    cod_pessoa = appRequest.cod_pessoa
  }

  var raw = JSON.stringify({
    "image": imgBase64,
    "cod_filial":""+appRequest.filial,
    "cod_pessoa":cod_pessoa
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  //http://127.0.0.1:8000
  //https://dev-k8s-api-gpconect.grupopereira.link/reconhecimento-facial

  // await fetch("http://127.0.0.1:8000/"+appRequest.app, requestOptions)
  //   .then(response => response.text())
  //   .then(result => result_face(result))
  //   .catch(error => console.log('error', error));
}


function result_face(result){

  console.log("Retorno API")
  console.log(result)

  localStorage.setItem('faceRequest',0)

}





