import {ElementObserver, ToggleSetting, ButtonSetting, RedirectButton} from './settingsClass.js';

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

// CHS

const DG_DOM = document.querySelector(".DG");

const buttonSettingDG = new RedirectButton(DG_DOM, "https://www.example.com/");

// RG

const RG_DOM = document.querySelector(".RG");

const buttonSettingRG = new RedirectButton(RG_DOM, "https://github.com/Kot2000/CarRacing.git");