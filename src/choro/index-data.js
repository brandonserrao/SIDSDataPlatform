//currently only used when apending rectangles
export const indexColors = {
  "mvi-index-index":{
    "Financial": "#0DB14B",
    "Economic": "#f0db3a",
    "Geographic": "#CC333F",
    "Environmental": "#00A0B0",
  },
  "egov":{
    "Human Capital Index":"",
    "Capital Assets Index":"",
    "Telecommunications Index":"",
    "Cybersiei":""
  }
};

export const indexWeightsDict={
  "mvi-index-index":{
    "normalization":true, "subindices":{
      "Financial": {
        "weight":1,
        "subsubindices":{
          "mvi-ST.INT.RCPT.XP.ZS-financial":1,
          "mvi-BX.TRF.PWKR.DT.GD.ZS-financial":1,
          "mvi-BX.KLT.DINV.WD.GD.ZS-financial":1
        }
      },
      "Economic": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-AIN-Index-economic":1,
          "mvi-ldc-XCON-Index-economic":1,
          "mvi-ldc-XIN-Index-economic":1
        }
      },
      "Geographic": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-LECZ-Index-geographic":1,
          "mvi-ldc-REM-Index-geographic":1
        }
      }, //"popDry",
      "Environmental": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-VIC-Index-environmental":1,
          "mvi-ldc-AFF-Index-environmental":1
        }
      }
    }
  },
  "egov-egi-unEGovernmentSurvey":{
    "normalization":false,
    "subindices":{
      "E-Participation Index":{
        "weight":1,
        "subsubindices":{
          "egov-epi-unEGovernmentSurvey":1
        }
      },
      "Human Capital Index":{
        "weight":1,
        "subsubindices":{
          "egov-hci-unEGovernmentSurvey":1
        }
      },
      "Online Service Index":{
        "weight":1,
        "subsubindices":{
          "egov-osi-unEGovernmentSurvey":1
        }
      },
      "Telecommunication Infrastructure Index":{
        "weight":1,
        "subsubindices":{
          "egov-tii-unEGovernmentSurvey":1
        }
      }
    }
  }
};

export const indexCodes = {
  "mvi-index-index":"mvi",
  "egov-egi-unEGovernmentSurvey":"egov"
}//,egov,etc.]
