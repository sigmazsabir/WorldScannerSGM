const apiKey = 'YOUR_GOOGLE_API_KEY';  // Buraya Google API anahtarınızı ekleyin

const imageUpload = document.getElementById('image-upload');
const removeImageBtn = document.getElementById('remove-image-btn');
const uploadedImage = document.getElementById('uploaded-image');
const showResultsBtn = document.getElementById('show-results-btn');
const resultsBox = document.getElementById('results');

let imageData = '';  // Fotoğraf verisini tutacağız
let identifiedId = '';  // Tanımlanan nesneye karşılık gelen ID'yi tutacağız

// Fotoğraf yüklendiğinde görseli kutuda göster
imageUpload.addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = 'block';
      removeImageBtn.style.display = 'block';  // "Resmi Kaldır" butonunu göster
      showResultsBtn.style.display = 'block'; // "Sonuçları Göster" butonunu göster
      imageData = e.target.result; // Fotoğraf verisini kaydediyoruz
    };
    reader.readAsDataURL(file);
  }
});

// Resmi Kaldır butonuna tıklama olayını ekliyoruz
removeImageBtn.addEventListener('click', function() {
  uploadedImage.src = '';  // Resmi kaldır
  uploadedImage.style.display = 'none';
  imageUpload.value = '';  // Yüklenen dosyayı temizle
  removeImageBtn.style.display = 'none';  // "Resmi Kaldır" butonunu gizle
  resultsBox.innerHTML = '';  // Sonuçları temizle
  showResultsBtn.style.display = 'none'; // "Sonuçları Göster" butonunu gizle
});

// "Sonuçları Göster" butonuna tıklama olayını ekliyoruz
showResultsBtn.addEventListener('click', function() {
  getImageResults(imageData);  // Fotoğraf verisini API'ye gönderip sonuçları al
  showResultsBtn.style.display = 'none'; // Butonu tekrar gizliyoruz
});

// Google Vision API ile fotoğrafı işleme ve otomatik yanıt almak için
function getImageResults(imageData) {
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;AIzaSyBX7EwlbQA_HbCsjBXxkCVecO33vRzHUDE
  const base64Image = imageData.split(',')[1]; // Fotoğrafı base64 formatına dönüştür

  const requestData = {
    requests: [{
      image: {
        content: base64Image
      },
      features: [{
        type: "LABEL_DETECTION",  // Etiket tespiti yapıyoruz
        maxResults: 5  // En fazla 5 sonuç alıyoruz
      }]
    }]
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.responses && data.responses[0].labelAnnotations) {
      const annotations = data.responses[0].labelAnnotations;
      let resultsHTML = '';
      
      // Google Vision API'nin döndüğü sonuçlardan id'yi seç
      annotations.forEach(annotation => {
        if (annotation.description.toLowerCase() === 'eşek') {
          identifiedId = "01";  // Eşek bulundu, ID'yi belirle
        }
      });
      
      // Yanıtları ekranda göster
      if (identifiedId) {
        const response = predefinedResponses[identifiedId];
        resultsHTML += `<strong>Tür:</strong> ${response.name} <br>
                         <strong>Sınıf:</strong> ${response.type} <br>
                         <strong>Açıklama:</strong> ${response.description} <br>
                         <strong>Yaşam Alanı:</strong> ${response.habitat} <br>
                         <strong>Beslenme Biçimi:</strong> ${response.diet} <br><br>`;
      } else {
        resultsHTML += 'Tanımlama bulunamadı.';
      }
      
      resultsBox.innerHTML = resultsHTML;
    }
  })
  .catch(error => {
    console.error('API Hatası:', error);  
    resultsBox.innerHTML = 'Bir hata oluştu.';
  });
}
