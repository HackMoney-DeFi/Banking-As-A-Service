import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import classnames from "classnames";
import Pool from "../pool/index";

function PoolsContainer() {
  const userId = useSelector(state => state.pool.selectedAddress);
  const poolMap = useSelector(state => state.pool.poolMap);

  const [view, setView] = useState("all");
  const [poolList, setPoolList] = useState();
  const [myPools, setMyPools] = useState();
  const [allPools, setAllPools] = useState();

  const activeTabClass = viewName =>
    classnames({
      "nav-link": true,
      active: view === viewName
    });

  useEffect(() => {
    if (poolMap) {
      setAllPools(Object.values(poolMap));
      setPoolList(Object.values(poolMap));
      const usersPools = Object.values(poolMap).filter(p => p.isUserAdmin === true);
      console.log(usersPools);
      setMyPools(usersPools);
    }
  }, [poolMap]);

  useEffect(() => {
    const pools = view === "all" ? allPools : myPools;
    setPoolList(pools);
  }, [view]);

  return (
    <div className="pools">
      {userId && allPools && (
        <>
        <ul className="nav nav-pills nav-pools">
          <li className="nav-item">
            <a className={activeTabClass("all")} onClick={() => setView("all")}>
              All Pools
            </a>
          </li>
          <li className="nav-item">
            <a
              className={activeTabClass("mine")}
              onClick={() => setView("mine")}
            >
              My Pools
            </a>
          </li>
        </ul>
        <div className="pools-container">
          {poolList.map(p => (
            <Pool name={p.poolName} numAdmins={p.totalPoolAdmins} amount={p.totalLiquidity} admins={[]} />
          ))}
        </div>
        </>
      )}
    </div>
  );
}

PoolsContainer.propTypes = {};

export default PoolsContainer;