import React from 'react';
import CreatePool from "../pool/create/CreatePool";
import { useSelector } from "react-redux";
import SlidingPanel from 'react-sliding-side-panel';
import PoolDetails from '../pool/detail/PoolDetails';
import WidthdrawalRequestForm from '../transactions/WithdrawalRequestForm';
import DepositForm from '../transactions/DepositRequestForm';

const sidePanelContents = {
  createPool: CreatePool,
  details: PoolDetails,
  withdraw: WidthdrawalRequestForm,
  deposit: DepositForm
};

function SidePanel() {
  const sidePanelView = useSelector(state => state.view.sidePanel);
  const sidePanelProps = useSelector(state => state.view.props);

  return (
    <SlidingPanel type={"right"} isOpen={!!sidePanelView} size={30}>
      <div className="sidepanel-bg">
        {
            sidePanelContents[sidePanelView] && React.createElement(sidePanelContents[sidePanelView], sidePanelProps)
        }
      </div>
    </SlidingPanel>
  );
}

export default SidePanel;
