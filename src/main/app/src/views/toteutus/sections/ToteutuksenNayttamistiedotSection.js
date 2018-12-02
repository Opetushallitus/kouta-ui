import React from 'react';
import {AbstractSection} from '../../../components/AbstractSection';
import {DropdownFilterSelector} from "../../../components/DropdownFilterSelector";

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
    },
    {
      label: 'Lääkäri',
      key: 'laakari'
    },
    {
      label: 'Fysioterapeutti',
      key: 'fysioterapeutti'
    },
    {
      label: 'Terveydenhoitaja',
      key: 'terveydenhoitaja'
    },
    {
      label: 'Hammasteknikko',
      key: 'hammasteknikko'
    },
    {
      label: 'Kirurgi',
      key: 'kirurgi'
    },
    {
      label: 'Geriatri',
      key: 'geriatri'
    },
    {
      label: 'Psykologi',
      key: 'psykologi'
    },
    {
      label: 'Psykiatri',
      key: 'psykiatri'
    },
    {
      label: 'Psykologi',
      key: 'psykologi'
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
      label: 'Geriatria',
      key: 'geriatria'
    },
    {
      label: 'Ravintotieto',
      key: 'ravintotieto'
    },
    {
      label: 'Kulkutaudit',
      key: 'kulkutaudit'
    },
    {
      label: 'Tukipalvelut',
      key: 'tukipalvelut'
    },
    {
      label: 'Eläimet',
      key: 'eläimet'
    },
    {
      label: 'Elämäntavat',
      key: 'elämäntavat'
    },
    {
      label: 'Seuranta',
      key: 'seuranta'
    }
  ];

  //move options into store
  setAmmattinimikeOptions = (ammattinimikeOptions) => this.setState({
    ...this.state,
    ammattinimikeOptions
  });

  setAvainsanaOptions = (avainsanaOptions) => this.setState({
    ...this.state,
    avainsanaOptions
  });

  renderContent = () => (
    <div className={'content'}>
        <DropdownFilterSelector label={'Ammattinimike'}
                                instruction={'Lisää ammattinimike (Max 5 kpl)'}
                                options={this.state.ammattinimikeOptions}
                                onSelect={this.setAmmattinimikeOptions}
                                maxTags={5}/>
        <DropdownFilterSelector label={'Avainsanat'}
                                instruction={'Lisää av (Max 5 kpl)'}
                                options={this.state.avainsanaOptions}
                                onSelect={this.setAvainsanaOptions}
                                maxTags={5}
      />
    </div>
  );

}
