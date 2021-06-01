import getOsaamisalaLaajuus from '#/src/utils/koulutus/getOsaamisalaLaajuus';
import { setDefaultMuodostumisSaanto } from '#/src/utils/koulutus/getOsaamisalaLaajuus';

test('sets default muodostumisSaanto for osaamisala that is missing it', () => {
  const osaamisala = {
    nimi: {
      fi: 'Talonrakennuksen osaamisala',
    },
    muodostumisSaanto: null,
    osaamisala: {
      nimi: {
        fi: 'Talonrakennuksen osaamisala',
      },
      osaamisalakoodiArvo: '1759',
    },
  };

  const defaultMuodostumisSaanto = {
    laajuus: {
      minimi: 145,
      maksimi: 145,
    },
  };

  expect(
    setDefaultMuodostumisSaanto(osaamisala, defaultMuodostumisSaanto)
      .muodostumisSaanto.laajuus.minimi
  ).toEqual(145);
});

test('keeps the original muodostumisSaanto for Avolouhinnan osaamisala that has it set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Avolouhinnan osaamisala',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 90,
        maksimi: 90,
      },
    },
    osaamisala: {
      nimi: {
        fi: 'Avolouhinnan osaamisala',
      },
      osaamisalakoodiArvo: '2271',
    },
  };

  const defaultMuodostumisSaanto = undefined;

  expect(
    setDefaultMuodostumisSaanto(osaamisala, defaultMuodostumisSaanto)
      .muodostumisSaanto.laajuus.minimi
  ).toEqual(90);
});

test('keeps the original muodostumisSaanto for Valinnaiset tutkinnon osat that has it set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Avolouhinnan osaamisala',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 90,
        maksimi: 90,
      },
    },
    osaamisala: {
      nimi: {
        fi: 'Avolouhinnan osaamisala',
      },
      osaamisalakoodiArvo: '2271',
    },
    osat: [
      {
        nimi: {
          fi: 'Valinnaiset tutkinnon osat',
        },
        muodostumisSaanto: {
          laajuus: {
            minimi: 90,
            maksimi: 90,
          },
        },
        osat: [
          {
            nimi: {
              fi:
                'Tutkinnon osa tai osia ammattitutkinnosta tai erikoisammattitutkinnosta',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 30,
                maksimi: 30,
              },
            },
          },
        ],
      },
    ],
  };

  const defaultMuodostumisSaanto = undefined;

  const result = setDefaultMuodostumisSaanto(
    osaamisala,
    defaultMuodostumisSaanto
  );

  expect(result.osat[0].muodostumisSaanto.laajuus.minimi).toEqual(90);
});

test('keeps the original muodostumisSaanto for "Tutkinnon osa tai osia ammattitutkinnosta tai erikoisammattitutkinnosta" that has it set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Avolouhinnan osaamisala',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 90,
        maksimi: 90,
      },
    },
    osaamisala: {
      nimi: {
        fi: 'Avolouhinnan osaamisala',
      },
      osaamisalakoodiArvo: '2271',
    },
    osat: [
      {
        nimi: {
          fi: 'Valinnaiset tutkinnon osat',
        },
        muodostumisSaanto: {
          laajuus: {
            minimi: 90,
            maksimi: 90,
          },
        },
        osat: [
          {
            nimi: {
              fi:
                'Tutkinnon osa tai osia ammattitutkinnosta tai erikoisammattitutkinnosta',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 30,
                maksimi: 30,
              },
            },
            osat: [],
          },
        ],
      },
    ],
  };

  const defaultMuodostumisSaanto = undefined;

  const result = setDefaultMuodostumisSaanto(
    osaamisala,
    defaultMuodostumisSaanto
  );

  expect(result.osat[0].osat[0].muodostumisSaanto.laajuus.minimi).toEqual(30);
});

test('sets "Ammatilliset tutkinnon osat" muodostumisSaanto for Talonrakennuksen osaamisala that does not have it set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Ammatilliset tutkinnon osat',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 145,
        maksimi: 145,
      },
    },
    osat: [
      {
        nimi: {
          fi: 'Talonrakennuksen osaamisala',
        },
        muodostumisSaanto: null,
        osaamisala: {
          nimi: {
            fi: 'Talonrakennuksen osaamisala',
          },
          osaamisalakoodiArvo: '1759',
        },
        osat: [
          {
            nimi: {
              fi: 'Pakollinen tutkinnon osa',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 50,
                maksimi: 50,
              },
            },
            osat: [],
          },
        ],
      },
      {
        nimi: {
          fi: 'Maarakennuksen osaamisala',
        },
        muodostumisSaanto: null,
        osaamisala: {
          nimi: {
            fi: 'Maarakennuksen osaamisala',
          },
          osaamisalakoodiArvo: '1757',
        },
        osat: [
          {
            nimi: {
              fi: 'Pakollinen tutkinnon osa',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 50,
                maksimi: 50,
              },
            },
            osat: [],
          },
        ],
      },
    ],
  };

  const defaultMuodostumisSaanto = undefined;

  const result = setDefaultMuodostumisSaanto(
    osaamisala,
    defaultMuodostumisSaanto
  );

  expect(result.osat[0].muodostumisSaanto.laajuus.minimi).toEqual(145);
});

test('sets "Ammatilliset tutkinnon osat" muodostumisSaanto for Maarakennuksen osaamisala that does not have it set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Ammatilliset tutkinnon osat',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 145,
        maksimi: 145,
      },
    },
    osat: [
      {
        nimi: {
          fi: 'Talonrakennuksen osaamisala',
        },
        muodostumisSaanto: null,
        osaamisala: {
          nimi: {
            fi: 'Talonrakennuksen osaamisala',
          },
          osaamisalakoodiArvo: '1759',
        },
        osat: [
          {
            nimi: {
              fi: 'Pakollinen tutkinnon osa',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 50,
                maksimi: 50,
              },
            },
            osat: [],
          },
        ],
      },
      {
        nimi: {
          fi: 'Maarakennuksen osaamisala',
        },
        muodostumisSaanto: null,
        osaamisala: {
          nimi: {
            fi: 'Maarakennuksen osaamisala',
          },
          osaamisalakoodiArvo: '1757',
        },
        osat: [
          {
            nimi: {
              fi: 'Pakollinen tutkinnon osa',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 50,
                maksimi: 50,
              },
            },
            osat: [],
          },
        ],
      },
    ],
  };

  const defaultMuodostumisSaanto = undefined;

  const result = setDefaultMuodostumisSaanto(
    osaamisala,
    defaultMuodostumisSaanto
  );

  expect(result.osat[0].muodostumisSaanto.laajuus.minimi).toEqual(145);
});

test('keeps muodostusSaanto for "Pakollinen tutkinnon osa" as it is originally set', () => {
  const osaamisala = {
    nimi: {
      fi: 'Ammatilliset tutkinnon osat',
    },
    muodostumisSaanto: {
      laajuus: {
        minimi: 145,
        maksimi: 145,
      },
    },
    osat: [
      {
        nimi: {
          fi: 'Talonrakennuksen osaamisala',
        },
        muodostumisSaanto: null,
        osaamisala: {
          nimi: {
            fi: 'Talonrakennuksen osaamisala',
          },
          osaamisalakoodiArvo: '1759',
        },
        osat: [
          {
            nimi: {
              fi: 'Pakollinen tutkinnon osa',
            },
            muodostumisSaanto: {
              laajuus: {
                minimi: 50,
                maksimi: 50,
              },
            },
            osat: [],
          },
        ],
      },
    ],
  };

  const defaultMuodostumisSaanto = undefined;

  const result = setDefaultMuodostumisSaanto(
    osaamisala,
    defaultMuodostumisSaanto
  );

  expect(result.osat[0].osat[0].muodostumisSaanto.laajuus.minimi).toEqual(50);
});

test('gets osaamisalan laajuus for Avolouhinnan osaamisala', () => {
  const osat = [
    {
      nimi: {
        fi: 'Pakolliset tutkinnon osat',
      },
      muodostumisSaanto: {
        laajuus: {
          minimi: 60,
          maksimi: 60,
        },
      },
      osaamisala: null,
    },
    {
      nimi: {
        fi: 'Avolouhinnan osaamisala',
      },
      muodostumisSaanto: {
        laajuus: {
          minimi: 90,
          maksimi: 90,
        },
      },
      osaamisala: {
        nimi: {
          fi: 'Avolouhinnan osaamisala',
        },
        osaamisalakoodiArvo: '2271',
      },
      osat: [
        {
          nimi: {
            fi: 'Valinnaiset tutkinnon osat',
          },
          muodostumisSaanto: {
            laajuus: {
              minimi: 90,
              maksimi: 90,
            },
          },
          osaamisala: null,
          osat: [
            {
              nimi: {
                fi:
                  'Tutkinnon osa tai osia ammattitutkinnosta tai erikoisammattitutkinnosta',
              },
              muodostumisSaanto: {
                laajuus: {
                  minimi: 30,
                  maksimi: 30,
                },
              },
              osaamisala: null,
            },
          ],
        },
      ],
    },
    {
      nimi: {
        fi: 'Maanalaisen kaivoksen osaamisala',
      },
      muodostumisSaanto: {
        laajuus: {
          minimi: 90,
          maksimi: 90,
        },
      },
      osaamisala: {
        nimi: {
          fi: 'Maanalaisen kaivoksen osaamisala',
        },
        osaamisalakoodiArvo: '2272',
      },
      osat: [
        {
          nimi: {
            fi: 'Avolouhinnan osaamisala',
          },
          muodostumisSaanto: {
            laajuus: {
              minimi: 90,
              maksimi: 90,
            },
          },
          osaamisala: null,
          osat: [
            {
              nimi: {
                fi:
                  'Tutkinnon osa tai osia ammattitutkinnosta tai erikoisammattitutkinnosta',
              },
              muodostumisSaanto: {
                laajuus: {
                  minimi: 30,
                  maksimi: 30,
                },
              },
              osaamisala: null,
            },
          ],
        },
      ],
    },
  ];

  const osaamisalakoodi = '2271';

  expect(getOsaamisalaLaajuus(osat, osaamisalakoodi)).toEqual(90);
});

test('gets osaamisalan laajuus for Maarakennuksen osaamisala from parent "Ammatilliset tutkinnon osat" as it is not set for osaamisala', () => {
  const osat = [
    {
      nimi: {
        fi: 'Ammatilliset tutkinnon osat',
      },
      muodostumisSaanto: {
        laajuus: {
          minimi: 145,
          maksimi: 145,
        },
      },
      osaamisala: null,
      osat: [
        {
          nimi: {
            fi: 'Pakollinen tutkinnon osa',
          },
          muodostumisSaanto: {
            laajuus: {
              minimi: 25,
              maksimi: 25,
            },
          },
          osaamisala: null,
        },
        {
          nimi: {
            fi: 'Talonrakennuksen osaamisala',
          },
          muodostumisSaanto: null,
          osaamisala: {
            nimi: {
              fi: 'Talonrakennuksen osaamisala',
            },
            osaamisalakoodiArvo: '1759',
          },
          osat: [
            {
              nimi: {
                fi: 'Pakollinen tutkinnon osa',
              },
              muodostumisSaanto: {
                laajuus: {
                  minimi: 50,
                  maksimi: 50,
                },
              },
              osaamisala: null,
            },
          ],
        },
        {
          nimi: {
            fi: 'Maarakennuksen osaamisala',
          },
          muodostumisSaanto: null,
          osaamisala: {
            nimi: {
              fi: 'Maarakennuksen osaamisala',
            },
            osaamisalakoodiArvo: '1757',
          },
          osat: [
            {
              nimi: {
                fi: 'Pakollinen tutkinnon osa',
              },
              muodostumisSaanto: {
                laajuus: {
                  minimi: 50,
                  maksimi: 50,
                },
              },
              osaamisala: null,
            },
          ],
        },
      ],
    },
  ];

  const osaamisalakoodi = '1757';

  expect(getOsaamisalaLaajuus(osat, osaamisalakoodi)).toEqual(145);
});
