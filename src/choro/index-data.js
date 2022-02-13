//currently only used when apending rectangles
export const indexColors = {
  "mvi-index":{
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
  "mvi-index":{
    "normalization":true,
    "subindices":{
      "Financial": {
        "weight":1,
        "subsubindices":{
          "mvi-wdi2-ST.INT.RCPT.XP.ZS":1,
          "mvi-wdi-BX.TRF.PWKR.DT.GD.ZS":1,
          "mvi-wdi-BX.KLT.DINV.WD.GD.ZS":1
        }
      },
      "Economic": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-AIN-Index":1,
          "mvi-ldc-XCON-Index":1,
          "mvi-ldc-XIN-Index":1
        }
      },
      "Geographic": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-LECZ-Index":1,
          "mvi-ldc-REM-Index":1
        }
      }, //"popDry",
      "Environmental": {
        "weight":1,
        "subsubindices":{
          "mvi-ldc-VIC-Index":1,
          "mvi-ldc-AFF-Index":1
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
  "mvi-index":"mvi",
  "egov-egi-unEGovernmentSurvey":"egov"
}//,egov,etc.]
