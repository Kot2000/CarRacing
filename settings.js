import {ElementObserver, ToggleSetting, ButtonSetting, RedirectButton, ToggableButton} from './settingsClass.js';

// FPS
const FPS_DOM = document.querySelector("#FPS").querySelector("input");

new ElementObserver("#FPS-STATS", (elements) => {
  const FPSC = (checked) => {
    if (checked == true) {
      elements[0].style.display = "block";
    } else if (checked == false) {
      elements[0].style.display = "none";
    }
  };
  
  const toggleSettingFPS = new ToggleSetting(FPS_DOM, 'FPS', false, FPSC);
  
  toggleSettingFPS.onTurned(FPSC);
});

// SHS

const SHS_DOM = document.querySelector("#SHS").querySelector("input");

const toggleSettingSHS = new ToggleSetting(SHS_DOM, 'SHS', true);

// CHS

const CHS_DOM = document.querySelector(".CHS");

const buttonSettingCHS = new ButtonSetting(CHS_DOM);
buttonSettingCHS.onClick(() => {
  localStorage.setItem("HS", 0);
});

// US

const US_DOM = document.querySelector("#US").querySelector("input");

const toggleSettingUS = new ToggleSetting(US_DOM, 'US', false);

// NC

const NC_DOM = document.querySelector("#NC").querySelector("input");

const toggleSettinsNC = new ToggleSetting(NC_DOM, 'NC', false);

// DM

const DM_DOM = document.querySelector("#DM").querySelector("input");

const toggleSettinsDM = new ToggleSetting(DM_DOM, 'DM', false);

toggleSettinsDM.onTurned(() => {
  location.reload();
});

// CHS

const DG_DOM = document.querySelector(".DG");

const buttonSettingDG = new RedirectButton(DG_DOM, "https://github.com/Kot2000/CarRacing/archive/refs/tags/1.0.1f-BETA.zip");

// RG

const RG_DOM = document.querySelector(".RG");

const buttonSettingRG = new RedirectButton(RG_DOM, "https://github.com/Kot2000/CarRacing.git");

// OKG

const OKG_DOM = document.querySelector(".OKG");

const buttonSettingOKG = new ToggableButton(OKG_DOM, "OKG", true);

if ((localStorage.getItem("OKG") == 'true' ? true : false) === true) {
  OKG_DOM.parentElement.style.display = 'flex';
} else {
  OKG_DOM.parentElement.style.display = 'none';
}

buttonSettingOKG.onClick(() => {
  OKG_DOM.parentElement.style.display = 'none';
});