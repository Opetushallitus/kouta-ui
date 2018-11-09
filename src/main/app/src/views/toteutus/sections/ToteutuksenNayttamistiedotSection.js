import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {CheckboxFilterSelector} from '../../../components/CheckboxFilterSelector';

export class ToteutuksenNayttamistiedotSection extends AbstractSection {

  onMount = () => {
    this.setState({
      ammattinimikeOptions: this.getAmmattinimikeOptions(),
      avainsanaOptions: this.getAvainsanaOptions()
    });
  };

  getClassName = () => 'ToteutuksenNayttamistiedotSection';

  getHeader = () => 'Koulutuksen näyttämiseen liittyvät tiedot';

  // replace this with data that comes from store
  getAmmattinimikeOptions = () => [
    {
      label: 'Hoiva-avustaja',
      key: 'hoiva-avustaja'
    },
    {
      label: 'Lastenhoitaja',
      key: 'lastenhoitaja'
    },
    {
      label: 'Laitoshoitaja',
      key: 'laitoshoitaja'
    },
    {
      label: 'Ambulanssihoitaja',
      key: 'ambulanssihoitaja'
    },
    {
      label: 'Lähihoitaja',
      key: 'lahihoitaja'
    },
    {
      label: 'Sairaanhoitaja',
      key: 'sairaanhoitaja'
    }
  ];

  // replace this with data that comes from store
  getAvainsanaOptions = () => [
    {
      label: 'Lapset',
      key: 'lapset'
    },
    {
      label: 'Nuoret',
      key: 'nuoret'
    },
    {
      label: 'Vanhukset',
      key: 'vanhukset'
    },
    {
      label: 'Ensiapu',
      key: 'ensiapu'
    },
    {
      label: 'Saattohoito',
      key: 'saattohoito'
    },
    {
      label: 'Kriisiapu',
      key: 'kriisiapu'
    }
  ];

  //move options into store
  setAmmattinimikeOptions = (ammattinimikeOptions) => {
    this.setState({
      ...this.state,
      ammattinimikeOptions
    })
  }

  setAvainsanaOptions = (avainsanaOptions) => {
    this.setState({
      ...this.state,
      avainsanaOptions
    })
  };

  renderContent = () => (
    <div className={'content'}>
      <CheckboxFilterSelector label={'Ammattinimike'}
                              instruction={'Lisää ammattinimike (Max 5 kpl)'}
                              options={this.state.ammattinimikeOptions}
                              onSelect={this.setAmmattinimikeOptions}
                              maxTags={5}
      />
      <CheckboxFilterSelector label={'Avainsanat'}
                              instruction={'Lisää av (Max 5 kpl)'}
                              options={this.state.avainsanaOptions}
                              onSelect={this.setAvainsanaOptions}
                              maxTags={5}
      />
    </div>
  );

}
