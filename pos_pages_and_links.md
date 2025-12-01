.dash-page-root {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  color: #e5e7eb;
}

.dash-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 18px;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.35), rgba(15, 23, 42, 0.98));
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.dash-page-header h1 {
  margin: 0;
  font-size: 1.1rem;
}

.dash-page-header p {
  margin: 2px 0 0;
  font-size: 0.85rem;
  opacity: 0.85;
}

.dash-page-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.dash-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  background: rgba(22, 163, 74, 0.9);
  color: #ecfdf5;
}

.dash-chip.soft {
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
}

.dash-section {
  background: rgba(15, 23, 42, 0.96);
  border-radius: 18px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  padding: 14px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dash-section h2 {
  margin: 0 0 4px;
  font-size: 0.95rem;
}

.dash-section-sub {
  margin: 0 0 12px;
  font-size: 0.8rem;
  opacity: 0.75;
}

.dash-modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 12px;
}

.dash-module-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  padding: 10px;
  background: radial-gradient(circle at top, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.95));
  border: 1px solid rgba(30, 64, 175, 0.7);
}

.dash-module-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.dash-module-head h3 {
  margin: 0;
  font-size: 0.9rem;
}

.status-pill {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 999px;
}

.status-pill.on {
  background: rgba(16, 185, 129, 0.95);
  color: #022c22;
}

.status-pill.off {
  background: rgba(15, 23, 42, 0.95);
  color: #e5e7eb;
  border: 1px solid rgba(75, 85, 99, 0.8);
}

.dash-module-desc {
  margin: 4px 0 8px;
  font-size: 0.8rem;
  opacity: 0.8;
}

.dash-module-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

/* toggle switch */
.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #1f2937;
  transition: 0.2s;
  border-radius: 999px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

.switch input:checked + .slider {
  background-color: #16a34a;
}

.switch input:checked + .slider:before {
  transform: translateX(16px);
}

.dash-open-btn {
  border-radius: 999px;
  border: none;
  padding: 6px 10px;
  font-size: 0.8rem;
  background: rgba(59, 130, 246, 0.9);
  color: #e5e7eb;
  cursor: pointer;
}

.dash-open-btn:disabled {
  background: rgba(31, 41, 55, 0.9);
  color: #9ca3af;
  cursor: default;
}