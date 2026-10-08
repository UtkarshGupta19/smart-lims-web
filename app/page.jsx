'use client';
import { useState } from 'react';

export default function SmartLimsDashboard() {
  // 1. Round Robin CPU Scheduling State
  const [tasks, setTasks] = useState([
    { pid: 101, name: 'Compile_C_Lab', burst: 6, rem: 6, state: 'READY' },
    { pid: 102, name: 'MATLAB_Simulation', burst: 4, rem: 4, state: 'READY' },
    { pid: 103, name: 'Database_Backup', burst: 2, rem: 2, state: 'READY' }
  ]);
  const [schedLog, setSchedLog] = useState('Scheduler initialized. Quantum = 2s.');

  // 2. Banker's Algorithm Deadlock Avoidance State
  const [available, setAvailable] = useState([3, 2, 2]); // [GPU, License, FPGA]
  const [allocated, setAllocated] = useState({
    Lab_A: [1, 0, 1],
    Lab_B: [1, 1, 0],
    Lab_C: [0, 1, 0]
  });
  const [bankerLog, setBankerLog] = useState('System in safe state. Resources: [GPU, License, FPGA]');

  // Step Round Robin Execution
  const stepRoundRobin = () => {
    let readyList = tasks.filter(t => t.rem > 0);
    if (readyList.length === 0) {
      setSchedLog('All jobs completed! Reload page to reset.');
      return;
    }
    let current = readyList[0];
    let quantum = 2;
    let exec = Math.min(quantum, current.rem);

    let updated = tasks.map(t => {
      if (t.pid === current.pid) {
        let remaining = t.rem - exec;
        return { ...t, rem: remaining, state: remaining === 0 ? 'TERMINATED' : 'READY' };
      }
      return t;
    });

    let finishedItem = updated.find(t => t.pid === current.pid);
    let others = updated.filter(t => t.pid !== current.pid);
    let newOrder = finishedItem.rem > 0 ? [...others, finishedItem] : [...others, finishedItem];

    setTasks(newOrder);
    setSchedLog(`Executed PID ${current.pid} (${current.name}) for ${exec}s. Remaining: ${current.rem - exec}s.`);
  };

  // Banker's Algorithm Safety Check
  const testBankerRequest = (lab, req) => {
    for (let i = 0; i < 3; i++) {
      if (req[i] > available[i]) {
        setBankerLog(`[DENIED] Request [${req}] exceeds available resources. Deadlock prevention triggered.`);
        return;
      }
    }
    let newAvail = available.map((v, i) => v - req[i]);
    let newAlloc = { ...allocated, [lab]: allocated[lab].map((v, i) => v + req[i]) };
    setAvailable(newAvail);
    setAllocated(newAlloc);
    setBankerLog(`[APPROVED] Allocated units [${req}] to ${lab}. System remains in a SAFE state.`);
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <header className="mb-4 pb-3 border-bottom">
        <span className="badge bg-primary mb-2">Group 101 | CCSE0303A</span>
        <h2>Smart-LIMS: Operating System Prototype</h2>
        <p className="text-secondary mb-0">Automated Laboratory Information & Resource Management System</p>
      </header>

      <div className="row g-4">
        {/* Module 1: CPU Scheduling */}
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h5 className="card-title text-primary">1. Round Robin CPU Scheduling (Quantum = 2s)</h5>
            <p className="small text-muted">Demonstrates Process Control Block (PCB) states, preemption, and queue rotation.</p>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>PID</th>
                    <th>Task Name</th>
                    <th>Burst Time</th>
                    <th>Remaining Time</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(t => (
                    <tr key={t.pid}>
                      <td>{t.pid}</td>
                      <td>{t.name}</td>
                      <td>{t.burst}s</td>
                      <td><strong>{t.rem}s</strong></td>
                      <td>
                        <span className={`badge ${t.state === 'TERMINATED' ? 'bg-secondary' : 'bg-success'}`}>
                          {t.state}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-outline-primary" onClick={stepRoundRobin}>Step 1 Quantum (2s)</button>
              <span className="text-secondary small">{schedLog}</span>
            </div>
          </div>
        </div>

        {/* Module 2: Deadlock Avoidance */}
        <div className="col-12">
          <div className="card shadow-sm p-4">
            <h5 className="card-title text-success">2. Deadlock Avoidance: Banker's Algorithm</h5>
            <p className="small text-muted">Simulates safe allocation of shared hardware/software licenses.</p>
            <div className="p-3 bg-light rounded mb-3">
              <div><strong>Available System Units:</strong> GPU Slots: {available[0]} | Licenses: {available[1]} | FPGA Kits: {available[2]}</div>
            </div>
            <div className="d-flex gap-2 flex-wrap mb-3">
              <button className="btn btn-sm btn-outline-success" onClick={() => testBankerRequest('Lab_A', [1, 0, 0])}>
                Request Safe (Lab A: 1 GPU)
              </button>
              <button className="btn btn-sm btn-outline-warning" onClick={() => testBankerRequest('Lab_B', [0, 1, 1])}>
                Request Safe (Lab B: 1 Lic, 1 FPGA)
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => testBankerRequest('Lab_C', [4, 0, 0])}>
                Request Over-Limit (Lab C: 4 GPUs)
              </button>
            </div>
            <div className="alert alert-secondary py-2 small mb-0">{bankerLog}</div>
          </div>
        </div>
      </div>
    </div>
  );
}