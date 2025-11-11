const slides = document.querySelectorAll(".slide");
const bolinhas = document.querySelector(".bolinhas");
let indice = 0;
// cria bolinhas automaticamente
slides.forEach((_, idx) => {
  const bolinha = document.createElement("span");
  if (idx === 0) bolinha.classList.add("ativo");
  bolinhas.appendChild(bolinha);
});
const pontos = bolinhas.querySelectorAll("span");
function trocar() {
  slides[indice].classList.remove("ativo");
  pontos[indice].classList.remove("ativo");

  indice = (indice + 1) % slides.length;

  slides[indice].classList.add("ativo");
  pontos[indice].classList.add("ativo");
}
setInterval(trocar, 3000);