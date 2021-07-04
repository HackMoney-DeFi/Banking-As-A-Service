
pragma solidity ^0.8.0;


library AuditorReports {

    struct Reports {
        Audit[] HistoricalAudits;
    }

    struct Audit {
       address[]    auditors; // People involved in auditing the pool
       string       fullAuditReport; // IPFS link to the audit reportS
    }
}