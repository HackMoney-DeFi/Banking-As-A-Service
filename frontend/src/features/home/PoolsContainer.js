import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import classnames from "classnames";
import Pool from "../pool/index";

const allPools = [
  {
    name: "Womens Education",
    amount: 35,
    admins: "sdf3fsa"
  },
  {
    name: "Smith Family",
    amount: 15,
    admins: "john"
  },
  {
    name: "Ethiopian Farmers Lmao",
    amount: 100,
    admins: "john"
  },
  {
    name: "Group Fund",
    amount: 15,
    admins: "john"
  },
  {
    name: "Health",
    amount: 30,
    admins: "john"
  },
  {
    name: "Some Cause",
    amount: 15,
    admins: "john"
  },
  {
    name: "Another One",
    amount: 2,
    admins: "john"
  }
];

const myPools = [
  {
    name: "Womens Education",
    amount: 35,
    admins: "sdf3fsa"
  }
];
function PoolsContainer() {
  const userId = useSelector(state => state.user.userId);
  const [view, setView] = useState("all");
  const [poolList, setPoolList] = useState(allPools);

  const activeTabClass = viewName =>
    classnames({
      "nav-link": true,
      active: view === viewName
    });

  useEffect(() => {
    const pools = view === "all" ? allPools : myPools;
    setPoolList(pools);
  }, [view]);

  return (
    <div className="pools">
      {userId && (
        <ul className="nav nav-pills">
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
      )}
      <div className="pools-container">
        {poolList.map(p => (
          <Pool name={p.name} amount={p.amount} admins={p.admins} />
        ))}
      </div>
    </div>
  );
}

PoolsContainer.propTypes = {};

export default PoolsContainer;
