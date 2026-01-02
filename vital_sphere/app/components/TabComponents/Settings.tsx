import { useState } from 'react'
import TabComponent from './SettingsComponents/TabComponent';
import { SettingTabs, UserData } from '@/app/modules/DataTypes';
import Profile from './SettingsComponents/Profile';
import Data from './SettingsComponents/Data';

interface SettingsProps {
  showErrorMessage: Function 
  setUserData: Function 
  setLoading: Function
  userData: UserData
}

const Settings = (props: SettingsProps) => {

  const [activeTab, setActiveTab] = useState<SettingTabs>(SettingTabs.PROFILE);

  function getActiveTab() {
    switch (activeTab) {
      case SettingTabs.PROFILE:
        return <Profile showErrorMessage={props.showErrorMessage} setUserData={props.setUserData} setLoading={props.setLoading} userData={props.userData} />
      case SettingTabs.DATA:
        return <Data showErrorMessage={props.showErrorMessage} setLoading={props.setLoading} />
    }
  }

  return (
    <section className="p-8 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <TabComponent activeTab={activeTab} setActiveTab={setActiveTab} />
      {getActiveTab()}
    </section>
  )
}

export default Settings