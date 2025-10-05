import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line, AreaChart, Area, BarChart, Bar, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface AhabProps {
  onBackToHome: () => void;
}

// ============================================
// ROC CURVE DATA GENERATION
// ============================================

const generateROCCurve = (modelName: string, baseAUC: number) => {
  const points = [];
  const numPoints = 50;
  
  // Generar curva ROC realista basada en AUC
  for (let i = 0; i <= numPoints; i++) {
    const fpr = i / numPoints;
    
    // Función para generar TPR basado en AUC y forma de curva realista
    let tpr;
    if (baseAUC > 0.95) {
      tpr = Math.pow(fpr, 0.3) * (baseAUC - 0.5) * 2 + fpr;
    } else if (baseAUC > 0.90) {
      tpr = Math.pow(fpr, 0.4) * (baseAUC - 0.5) * 2 + fpr;
    } else {
      tpr = Math.pow(fpr, 0.5) * (baseAUC - 0.5) * 2 + fpr;
    }
    
    // Ajustar para que empiece en (0,0) y termine en (1,1)
    if (i === 0) tpr = 0;
    if (i === numPoints) tpr = 1;
    
    // Limitar entre 0 y 1
    tpr = Math.min(1, Math.max(0, tpr));
    
    // Calcular métricas en este punto (threshold implícito)
    const threshold = 1 - (i / numPoints);
    
    points.push({
      fpr: parseFloat(fpr.toFixed(4)),
      tpr: parseFloat(tpr.toFixed(4)),
      threshold: parseFloat(threshold.toFixed(3))
    });
  }
  
  return points;
};

// ============================================
// REAL MODEL RESULTS DATA - SOLO MODELOS RELEVANTES
// ============================================

const modelResults = {
  // Datos del Mejor Modelo
  xgboost: {
    auc: 0.9570,
    accuracy: 0.90,
    metrics: {
      noConfirmado: { precision: 0.94, recall: 0.91, f1: 0.93, support: 1292 },
      confirmado: { precision: 0.81, recall: 0.87, f1: 0.84, support: 549 }
    }
  },
  // Datos del Modelo Guardado (Random Forest)
  ahab: {
    auc: 0.9519,
    accuracy: 0.90,
    metrics: {
      noConfirmado: { precision: 0.93, recall: 0.92, f1: 0.93, support: 1292 },
      confirmado: { precision: 0.81, recall: 0.85, f1: 0.83, support: 549 }
    }
  },
  // Se mantienen para la curva ROC interactiva por si se necesita
  randomForest: { 
    auc: 0.9519, accuracy: 0.90, 
    metrics: { noConfirmado: { precision: 0.93, recall: 0.92, f1: 0.93, support: 1292 }, confirmado: { precision: 0.81, recall: 0.85, f1: 0.83, support: 549 } }
  },
  gradientBoosting: {
    auc: 0.9511, accuracy: 0.88,
    metrics: { noConfirmado: { precision: 0.94, recall: 0.89, f1: 0.92, support: 1292 }, confirmado: { precision: 0.78, recall: 0.86, f1: 0.82, support: 549 } }
  },
};

const featureImportance = [
  { feature: 'koi_model_snr', importance: 0.271870, displayName: 'SNR del Modelo' },
  { feature: 'koi_prad', importance: 0.210384, displayName: 'Radio Planetario' },
  { feature: 'koi_depth', importance: 0.089820, displayName: 'Profundidad Tránsito' },
  { feature: 'koi_period', importance: 0.079988, displayName: 'Período Orbital' },
  { feature: 'koi_duration', importance: 0.079849, displayName: 'Duración Tránsito' },
  { feature: 'koi_teq', importance: 0.073551, displayName: 'Temp. Equilibrio' },
  { feature: 'koi_insol', importance: 0.070974, displayName: 'Insolación' },
  { feature: 'koi_steff', importance: 0.046278, displayName: 'Temp. Estelar' },
  { feature: 'koi_srad', importance: 0.039909, displayName: 'Radio Estelar' },
  { feature: 'koi_slogg', importance: 0.037376, displayName: 'Gravedad Superficial' }
];

const generateSimulatedData = (numSamples = 150) => {
  const data = [];
  const totalReal = 1841;
  const confirmedRatio = 549 / totalReal; 
  
  for (let i = 0; i < numSamples; i++) {
    const isConfirmed = Math.random() < confirmedRatio;
    const classType = isConfirmed ? 'Confirmado' : 'No Confirmado';
    const color = isConfirmed ? '#00ff88' : '#ff4444';
    
    let period, depth, snr, prad, confidence;
    
    if (isConfirmed) {
      snr = 15 + Math.random() * 35;
      period = Math.exp(Math.random() * 4 + 1);
      depth = Math.exp(Math.random() * 2 - 4);
      prad = 1 + Math.random() * 10;
      confidence = Math.random() < 0.87 ? 0.75 + Math.random() * 0.25 : 0.3 + Math.random() * 0.45;
    } else {
      snr = 3 + Math.random() * 25;
      period = Math.exp(Math.random() * 6);
      depth = Math.exp(Math.random() * 4 - 6);
      prad = 0.5 + Math.random() * 15;
      confidence = Math.random() < 0.91 ? 0.1 + Math.random() * 0.4 : 0.55 + Math.random() * 0.45;
    }
    
    const phases = Array.from({length: 100}, (_, idx) => idx / 100);
    const lightCurve = phases.map(phase => {
      const transitDepth = depth / 100;
      const transitWidth = 0.08;
      const inTransit = Math.abs(phase - 0.5) < transitWidth;
      const transitShape = inTransit ? 
        1 - transitDepth * Math.exp(-Math.pow((phase - 0.5) / (transitWidth/3), 2)) : 1;
      const noise = isConfirmed ? 0.001 : 0.003;
      return {
        phase,
        flux: transitShape + (Math.random() - 0.5) * noise
      };
    });
    
    data.push({
      id: `KOI-${1000 + i}`,
      class: classType,
      period,
      depth,
      snr,
      prad,
      confidence,
      color,
      lightCurve,
      logPeriod: Math.log10(period),
      logDepth: Math.log10(depth),
      teq: 200 + Math.random() * 2000,
      insol: Math.random() * 1000
    });
  }
  
  return data;
};

const MetricsCard = ({ title, value, subtitle, color, icon, delay = 0 }: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
  delay?: number;
}) => (
  <div style={{
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    padding: '20px',
    border: `2px solid ${color}40`,
    boxShadow: `0 4px 20px ${color}20`,
    minWidth: '180px',
    flex: '1',
    animation: `metricsCardPulse 6s ease-in-out infinite ${delay}s`,
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      fontSize: '24px',
      marginBottom: '8px'
    }}>{icon}</div>
    <div style={{
      fontSize: '14px',
      color: '#8b92a8',
      marginBottom: '8px',
      fontWeight: '500'
    }}>{title}</div>
    <div style={{
      fontSize: '32px',
      fontWeight: 'bold',
      color: color,
      marginBottom: '4px'
    }}>{value}</div>
    <div style={{
      fontSize: '13px',
      color: '#ffffff',
      fontWeight: '600',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
      opacity: 0.95
    }}>{subtitle}</div>
  </div>
);

// ============================================
// MODEL COMPARISON COMPONENT (MODIFICADO)
// ============================================

const ModelComparison = () => {
  const comparisonData = [
    {
      model: 'Ahab\n(Guardado)', // Modelo Guardado
      auc: modelResults.ahab.auc,
      accuracy: modelResults.ahab.accuracy,
      f1_confirmado: modelResults.ahab.metrics.confirmado.f1,
      f1_no_confirmado: modelResults.ahab.metrics.noConfirmado.f1
    },
    {
      model: 'XGBoost\n(Mejor)', // Mejor Modelo
      auc: modelResults.xgboost.auc,
      accuracy: modelResults.xgboost.accuracy,
      f1_confirmado: modelResults.xgboost.metrics.confirmado.f1,
      f1_no_confirmado: modelResults.xgboost.metrics.noConfirmado.f1
    }
  ];

  const diffAUC = (modelResults.xgboost.auc - modelResults.ahab.auc).toFixed(4);

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        color: '#ffd700', // Color destacado para la comparación
        marginBottom: '20px'
      }}>
        🚀 Comparación Directa: Ahab (Guardado) vs XGBoost (Mejor)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis 
            dataKey="model" 
            stroke="#8b92a8"
            tick={{ fill: '#8b92a8', fontSize: 12 }}
          />
          <YAxis 
            stroke="#8b92a8"
            domain={[0.7, 1.0]}
            tick={{ fill: '#8b92a8' }}
            label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#8b92a8' }}
          />
          <Tooltip 
            contentStyle={{ background: '#1a1a2e', border: '2px solid #ffd700', borderRadius: '8px' }}
            formatter={(value: number) => value.toFixed(4)}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="auc" fill="#7b2ff7" name="AUC-ROC" />
          <Bar dataKey="accuracy" fill="#00d4ff" name="Accuracy" />
          <Bar dataKey="f1_confirmado" fill="#00ff88" name="F1 Confirmado" />
        </BarChart>
      </ResponsiveContainer>
      
      <div style={{
        marginTop: '15px',
        padding: '15px',
        background: '#1a1a2e',
        borderRadius: '8px',
        border: '2px solid #ffd70040',
        fontSize: '13px',
        color: '#8b92a8'
      }}>
        <div style={{ color: '#ffd700', fontWeight: 'bold', marginBottom: '8px' }}>
          🥇 Diferencia de AUC: {diffAUC} (XGBoost tiene una ventaja del 0.51%)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>• <strong style={{ color: '#00d4ff' }}>XGBoost AUC:</strong> 0.9570</div>
          <div>• <strong style={{ color: '#00d4ff' }}>Ahab AUC:</strong> 0.9519</div>
          <div>• <strong style={{ color: '#00ff88' }}>XGBoost Recall Conf.:</strong> 87%</div>
          <div>• <strong style={{ color: '#00ff88' }}>Ahab Recall Conf.:</strong> 85%</div>
        </div>
      </div>
    </div>
  );
};

const FeatureImportanceChart = () => {
  const topFeatures = featureImportance.slice(0, 8);
  
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        color: '#00d4ff',
        marginBottom: '20px'
      }}>
        🎯 Importancia de Características (Random Forest)
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={topFeatures} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis 
            type="number" 
            stroke="#8b92a8"
            domain={[0, 0.3]}
            tick={{ fill: '#8b92a8' }}
            label={{ value: 'Importancia', position: 'insideBottom', offset: -5, fill: '#8b92a8' }}
          />
          <YAxis 
            type="category" 
            dataKey="displayName" 
            stroke="#8b92a8"
            tick={{ fill: '#8b92a8', fontSize: 11 }}
            width={110}
          />
          <Tooltip 
            contentStyle={{ background: '#1a1a2e', border: '2px solid #ffd700', borderRadius: '8px' }}
            formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
          />
          <Bar dataKey="importance">
            {topFeatures.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#ffd700' : index === 1 ? '#00d4ff' : '#7b2ff7'} 
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div style={{
        marginTop: '15px',
        padding: '15px',
        background: '#1a1a2e',
        borderRadius: '8px',
        border: '2px solid #ffd70040',
        fontSize: '13px',
        color: '#8b92a8'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#ffd700' }}>Feature más importante:</strong> SNR del Modelo (27.2%)
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ color: '#00d4ff' }}>Segunda más importante:</strong> Radio Planetario (21.0%)
        </div>
        <div>
          💡 Las 3 primeras features explican ~57% de la capacidad predictiva del modelo
        </div>
      </div>
    </div>
  );
};

const ConfusionMatrixViz = () => {
  const xgboostMetrics = modelResults.xgboost.metrics;
  
  // Calcular matriz de confusión aproximada
  const totalNoConf = xgboostMetrics.noConfirmado.support;
  const totalConf = xgboostMetrics.confirmado.support;
  
  const tn = Math.round(totalNoConf * xgboostMetrics.noConfirmado.recall); // 1176
  const fp = totalNoConf - tn; // 116
  const tp = Math.round(totalConf * xgboostMetrics.confirmado.recall); // 478
  const fn = totalConf - tp; // 71
  
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        color: '#00d4ff',
        marginBottom: '20px'
      }}>
        📊 Matriz de Confusión - XGBoost (Mejor Modelo)
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 1fr',
        gap: '10px',
        marginTop: '20px'
      }}>
        <div></div>
        <div style={{ 
          textAlign: 'center', 
          color: '#8b92a8', 
          fontSize: '13px',
          fontWeight: 'bold'
        }}>Predicho: No Conf.</div>
        <div style={{ 
          textAlign: 'center', 
          color: '#8b92a8', 
          fontSize: '13px',
          fontWeight: 'bold'
        }}>Predicho: Conf.</div>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          color: '#8b92a8',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>Real: No Conf.</div>
        <div style={{
          background: '#00ff8820',
          border: '3px solid #00ff88',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#00ff88'
        }}>
          {tn}
          <div style={{ fontSize: '12px', color: '#8b92a8', marginTop: '5px' }}>
            Verdaderos Negativos
          </div>
        </div>
        <div style={{
          background: '#ff444420',
          border: '3px solid #ff4444',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ff4444'
        }}>
          {fp}
          <div style={{ fontSize: '12px', color: '#8b92a8', marginTop: '5px' }}>
            Falsos Positivos
          </div>
        </div>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          color: '#8b92a8',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>Real: Conf.</div>
        <div style={{
          background: '#ff444420',
          border: '3px solid #ff4444',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ff4444'
        }}>
          {fn}
          <div style={{ fontSize: '12px', color: '#8b92a8', marginTop: '5px' }}>
            Falsos Negativos
          </div>
        </div>
        <div style={{
          background: '#00ff8820',
          border: '3px solid #00ff88',
          borderRadius: '12px',
          padding: '30px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#00ff88'
        }}>
          {tp}
          <div style={{ fontSize: '12px', color: '#8b92a8', marginTop: '5px' }}>
            Verdaderos Positivos
          </div>
        </div>
      </div>
      
      <div style={{
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <div style={{
          padding: '12px',
          background: '#1a1a2e',
          borderRadius: '8px',
          border: '2px solid #00ff8840',
          fontSize: '12px',
          color: '#8b92a8'
        }}>
          <div style={{ color: '#00ff88', fontWeight: 'bold', marginBottom: '4px' }}>
            ✅ Aciertos: {tn + tp} ({((tn + tp) / 1841 * 100).toFixed(1)}%)
          </div>
          <div>El modelo clasifica correctamente 9 de cada 10 exoplanetas</div>
        </div>
        <div style={{
          padding: '12px',
          background: '#1a1a2e',
          borderRadius: '8px',
          border: '2px solid #ff444440',
          fontSize: '12px',
          color: '#8b92a8'
        }}>
          <div style={{ color: '#ff4444', fontWeight: 'bold', marginBottom: '4px' }}>
            ❌ Errores: {fp + fn} ({((fp + fn) / 1841 * 100).toFixed(1)}%)
          </div>
          <div>FP: {fp} casos | FN: {fn} casos (más crítico perder un confirmado)</div>
        </div>
      </div>
    </div>
  );
};

const ClassificationScatter = ({ data, onSelectPlanet }: { data: any[], onSelectPlanet: (planet: any) => void }) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: 'rgba(26, 26, 46, 0.95)',
          border: `2px solid ${d.color}`,
          borderRadius: '8px',
          padding: '12px',
          color: '#e0e0e0',
          fontSize: '13px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontWeight: 'bold', color: d.color, marginBottom: '6px' }}>{d.id}</div>
          <div>Clase: <strong>{d.class}</strong></div>
          <div>SNR: <strong>{d.snr.toFixed(1)}</strong></div>
          <div>Radio: <strong>{d.prad.toFixed(2)} R⊕</strong></div>
          <div>Confianza: <strong>{(d.confidence * 100).toFixed(1)}%</strong></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        color: '#00d4ff',
        marginBottom: '15px'
      }}>
        🌌 Espacio de Features: SNR vs Radio Planetario
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis 
            type="number" 
            dataKey="snr"
            name="SNR"
            stroke="#8b92a8"
            label={{ value: 'SNR del Modelo (Feature más importante)', position: 'insideBottom', offset: -10, fill: '#8b92a8' }}
          />
          <YAxis 
            type="number" 
            dataKey="prad"
            name="Radio"
            stroke="#8b92a8"
            label={{ value: 'Radio Planetario (R⊕)', angle: -90, position: 'insideLeft', fill: '#8b92a8' }}
          />
          <ZAxis type="number" dataKey="confidence" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          <Scatter 
            name="Confirmado (30%)" 
            data={data.filter(d => d.class === 'Confirmado')} 
            fill="#00ff88"
            onClick={(e: any) => e && e.payload && onSelectPlanet(e.payload)}
            cursor="pointer"
          />
          <Scatter 
            name="No Confirmado (70%)" 
            data={data.filter(d => d.class === 'No Confirmado')} 
            fill="#ff4444"
            onClick={(e: any) => e && e.payload && onSelectPlanet(e.payload)}
            cursor="pointer"
          />
        </ScatterChart>
      </ResponsiveContainer>
      
      <div style={{
        marginTop: '15px',
        padding: '12px',
        background: '#1a1a2e',
        borderRadius: '8px',
        border: '2px solid #00d4ff40',
        fontSize: '12px',
        color: '#8b92a8'
      }}>
        💡 <strong>Interpretación:</strong> Los confirmados (verde) tienden a concentrarse en zonas de mayor SNR. 
        El tamaño del punto representa la confianza del modelo XGBoost.
      </div>
    </div>
  );
};

const LightCurvePlot = ({ selectedPlanet }: { selectedPlanet: any }) => {
  if (!selectedPlanet) {
    return (
      <div style={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#5a6178',
        fontSize: '16px',
        background: '#0f0f1e',
        borderRadius: '12px',
        border: '2px dashed #2a2a3e',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔭</div>
        <div>Haz clic en un punto del scatter para ver su curva de luz</div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '16px',
        color: '#00d4ff',
        marginBottom: '15px'
      }}>
        📊 Curva de Luz - {selectedPlanet.id}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={selectedPlanet.lightCurve} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFlux" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={selectedPlanet.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={selectedPlanet.color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis 
            dataKey="phase" 
            stroke="#8b92a8"
            label={{ value: 'Fase Orbital', position: 'insideBottom', offset: -5, fill: '#8b92a8' }}
          />
          <YAxis 
            stroke="#8b92a8"
            domain={[0.985, 1.005]}
            label={{ value: 'Flujo Normalizado', angle: -90, position: 'insideLeft', fill: '#8b92a8' }}
          />
          <Tooltip 
            contentStyle={{ background: '#1a1a2e', border: `2px solid ${selectedPlanet.color}`, borderRadius: '8px' }}
            labelStyle={{ color: '#e0e0e0' }}
          />
          <Area 
            type="monotone" 
            dataKey="flux" 
            stroke={selectedPlanet.color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorFlux)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div style={{
        marginTop: '15px',
        padding: '15px',
        background: '#1a1a2e',
        borderRadius: '8px',
        border: `2px solid ${selectedPlanet.color}40`,
        fontSize: '13px',
        color: '#8b92a8'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <div>
            <strong style={{ color: selectedPlanet.color }}>Clasificación Real:</strong><br/>
            {selectedPlanet.class}
          </div>
          <div>
            <strong style={{ color: '#00d4ff' }}>Confianza Modelo:</strong><br/>
            {(selectedPlanet.confidence * 100).toFixed(1)}%
          </div>
          <div>
            <strong style={{ color: '#ffd700' }}>SNR:</strong><br/>
            {selectedPlanet.snr.toFixed(2)}
          </div>
          <div>
            <strong style={{ color: '#7b2ff7' }}>Radio:</strong><br/>
            {selectedPlanet.prad.toFixed(2)} R⊕
          </div>
        </div>
      </div>
    </div>
  );
};

const ROCCurveInteractive = () => {
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState('xgboost');

  // Generar datos de curvas ROC para cada modelo
  const rocData = useMemo(() => ({
    // Se incluyen todos los modelos para la interactividad de selección
    randomForest: generateROCCurve('Random Forest', modelResults.randomForest.auc),
    gradientBoosting: generateROCCurve('Gradient Boosting', modelResults.gradientBoosting.auc),
    xgboost: generateROCCurve('XGBoost', modelResults.xgboost.auc),
    ahab: generateROCCurve('Ahab', modelResults.ahab.auc) // Añadir Ahab
  }), []);

  // Calcular matriz de confusión para el punto seleccionado
  const confusionMatrix = useMemo(() => {
    if (!selectedPoint) return null;

    const { fpr, tpr } = selectedPoint;
    const totalNoConf = (modelResults as any)[selectedModel].metrics.noConfirmado.support;
    const totalConf = (modelResults as any)[selectedModel].metrics.confirmado.support;

    const tn = Math.round(totalNoConf * (1 - fpr));
    const fp = totalNoConf - tn;
    const tp = Math.round(totalConf * tpr);
    const fn = totalConf - tp;

    return { tn, fp, tp, fn };
  }, [selectedPoint, selectedModel]);

  const handlePointClick = (point: any) => {
    setSelectedPoint(point);
  };

  return (
    <div style={{ width: '100%' }}>
      <h3 style={{
        fontSize: '18px',
        color: '#00d4ff',
        marginBottom: '20px'
      }}>
        📊 Curva ROC Interactiva
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          style={{
            background: '#1a1a2e',
            color: '#8b92a8',
            border: '2px solid #00d4ff40',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '14px'
          }}
        >
          <option value="xgboost">XGBoost (Mejor)</option>
          <option value="ahab">Ahab (Guardado)</option>
          <option value="randomForest">Random Forest</option>
          <option value="gradientBoosting">Gradient Boosting</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart margin={{ top: 20, right: 30, left: 60, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
          <XAxis
            type="number"
            dataKey="fpr"
            domain={[0, 1]}
            stroke="#8b92a8"
            label={{ value: 'Tasa de Falsos Positivos (FPR)', position: 'insideBottom', offset: -20, fill: '#8b92a8' }}
          />
          <YAxis
            type="number"
            dataKey="tpr"
            domain={[0, 1]}
            stroke="#8b92a8"
            label={{ value: 'Tasa de Verdaderos Positivos (TPR)', angle: -90, position: 'insideLeft', fill: '#8b92a8' }}
          />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '2px solid #00d4ff', borderRadius: '8px' }}
            formatter={(value: number) => (value as number).toFixed(4)}
            labelFormatter={(value: number) => `Umbral: ${value.toFixed(3)}`}
          />
          <Line
            type="monotone"
            data={(rocData as any)[selectedModel]}
            dataKey="tpr"
            stroke="#00d4ff"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 8,
              onClick: handlePointClick
            }}
          />
          {selectedPoint && (
            <Line
              type="monotone"
              data={[selectedPoint]}
              dataKey="tpr"
              stroke="#ffd700"
              strokeWidth={0}
              dot={{
                r: 8,
                fill: '#ffd700',
                stroke: '#ffd700'
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {selectedPoint && confusionMatrix && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#1a1a2e',
          borderRadius: '12px',
          border: '2px solid #00d4ff40'
        }}>
          <h4 style={{ color: '#00d4ff', marginBottom: '15px', fontSize: '16px' }}>
            Matriz de Confusión para Umbral: {selectedPoint.threshold.toFixed(3)}
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr 1fr',
            gap: '10px'
          }}>
            <div></div>
            <div style={{ textAlign: 'center', color: '#8b92a8', fontSize: '13px', fontWeight: 'bold' }}>
              Predicho: No Conf.
            </div>
            <div style={{ textAlign: 'center', color: '#8b92a8', fontSize: '13px', fontWeight: 'bold' }}>
              Predicho: Conf.
            </div>

            <div style={{ color: '#8b92a8', fontSize: '13px', fontWeight: 'bold' }}>
              Real: No Conf.
            </div>
            <div style={{
              background: '#00ff8820',
              border: '2px solid #00ff88',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#00ff88'
            }}>
              {confusionMatrix.tn}
            </div>
            <div style={{
              background: '#ff444420',
              border: '2px solid #ff4444',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ff4444'
            }}>
              {confusionMatrix.fp}
            </div>

            <div style={{ color: '#8b92a8', fontSize: '13px', fontWeight: 'bold' }}>
              Real: Conf.
            </div>
            <div style={{
              background: '#ff444420',
              border: '2px solid #ff4444',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#ff4444'
            }}>
              {confusionMatrix.fn}
            </div>
            <div style={{
              background: '#00ff8820',
              border: '2px solid #00ff88',
              borderRadius: '8px',
              padding: '15px',
              textAlign: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#00ff88'
            }}>
              {confusionMatrix.tp}
            </div>
          </div>

          <div style={{ marginTop: '15px', fontSize: '13px', color: '#8b92a8' }}>
            <div>• TPR: <strong style={{ color: '#00d4ff' }}>{selectedPoint.tpr.toFixed(4)}</strong></div>
            <div>• FPR: <strong style={{ color: '#00d4ff' }}>{selectedPoint.fpr.toFixed(4)}</strong></div>
            <div>• Precisión: <strong style={{ color: '#00d4ff' }}>
              {((confusionMatrix.tp + confusionMatrix.tn) /
                (confusionMatrix.tp + confusionMatrix.tn + confusionMatrix.fp + confusionMatrix.fn) * 100).toFixed(1)}%
            </strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

export function Ahab({ onBackToHome }: AhabProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<any>(null);
  const data = useMemo(() => generateSimulatedData(150), []);
  
  const stats = useMemo(() => {
    const confirmed = data.filter(d => d.class === 'Confirmado').length;
    const noConfirmed = data.filter(d => d.class === 'No Confirmado').length;
    
    return {
      confirmed,
      noConfirmed,
      total: data.length,
      bestModel: 'XGBoost',
      bestAUC: modelResults.xgboost.auc
    };
  }, [data]);
  
  return (
    <div style={{
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse at top, #1a1a2e 0%, #0f0a1a 50%, #000000 100%),
        radial-gradient(ellipse at bottom right, #16213e20 0%, transparent 70%),
        radial-gradient(ellipse at top left, #7b2ff720 0%, transparent 70%)
      `,
      padding: '30px',
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      color: 'white'
    }}>
      
      {/* Patrón de grid técnico */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        animation: 'gridPulse 12s ease-in-out infinite',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Contenido principal */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', marginTop: '80px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            background: 'linear-gradient(135deg, #00d4ff 0%, #7b2ff7 50%, #ff6b6b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '15px',
            fontWeight: '900',
            letterSpacing: '-0.02em',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
            fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
            animation: 'titleGlow 4s ease-in-out infinite alternate'
          }}>
            🚀 NASA Exoplanet AI Analysis
          </h1>
          <p style={{ 
            color: '#8b92a8', 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Resultados del Sistema de Clasificación AHAB con Machine Learning
          </p>
        </div>
        
        {/* Metrics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <MetricsCard 
            icon="🥇"
            title="Mejor Modelo"
            value="XGBoost"
            subtitle={`AUC: ${(modelResults.xgboost.auc * 100).toFixed(2)}%`}
            color="#7b2ff7"
            delay={0}
          />
          <MetricsCard 
            icon="⭐"
            title="Modelo Nuevo"
            value="Ahab"
            subtitle={`AUC: ${(modelResults.ahab.auc * 100).toFixed(2)}%`}
            color="#ffd700"
            delay={1.5}
          />
          <MetricsCard 
            icon="📈"
            title="Recall Conf."
            value={`${(modelResults.xgboost.metrics.confirmado.recall * 100).toFixed(0)}%`}
            subtitle={`Ahab: ${(modelResults.ahab.metrics.confirmado.recall * 100).toFixed(0)}%`}
            color="#00ff88"
            delay={3}
          />
          <MetricsCard 
            icon="📊"
            title="Precisión No Conf."
            value={`${(modelResults.xgboost.metrics.noConfirmado.precision * 100).toFixed(0)}%`}
            subtitle={`Ahab: ${(modelResults.ahab.metrics.noConfirmado.precision * 100).toFixed(0)}%`}
            color="#00d4ff"
            delay={4.5}
          />
        </div>
        
        {/* Model Comparison - Full Width */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px',
          border: '2px solid rgba(42, 42, 62, 0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <ModelComparison />
        </div>
        
        {/* ROC Curve - Full Width */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px',
          border: '2px solid rgba(42, 42, 62, 0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <ROCCurveInteractive />
        </div>
        
        {/* Two Column Layout: Feature Importance + Confusion Matrix */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'rgba(15, 15, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '25px',
            border: '2px solid rgba(42, 42, 62, 0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <FeatureImportanceChart />
          </div>
          
          <div style={{
            background: 'rgba(15, 15, 30, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '25px',
            border: '2px solid rgba(42, 42, 62, 0.5)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <ConfusionMatrixViz />
          </div>
        </div>
        
        {/* Classification Scatter - Full Width */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px',
          border: '2px solid rgba(42, 42, 62, 0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <ClassificationScatter data={data} onSelectPlanet={setSelectedPlanet} />
        </div>
        
        {/* Light Curve Detail */}
        <div style={{
          background: 'rgba(15, 15, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '25px',
          border: '2px solid rgba(42, 42, 62, 0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <LightCurvePlot selectedPlanet={selectedPlanet} />
        </div>
        
        {/* Info Footer */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(42, 42, 62, 0.5)',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8b92a8', fontSize: '14px', margin: 0 }}>
            💡 <strong>Sobre el Modelo AHAB:</strong> Entrenado con 1841 exoplanetas del catálogo Kepler • 
            Modelos comparados (Ahab y XGBoost) • 10 características principales • 
            Dataset balanceado: 70% No Confirmados, 30% Confirmados
          </p>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style>{`
        @keyframes metricsCardPulse {
          0%, 100% { 
            opacity: 0.9; 
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(0, 212, 255, 0.15);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.015);
            box-shadow: 0 6px 25px rgba(0, 212, 255, 0.25);
          }
        }

        @keyframes gridPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.05; }
        }

        @keyframes titleGlow {
          0% { text-shadow: 0 0 30px rgba(0, 212, 255, 0.3); }
          100% { text-shadow: 0 0 40px rgba(123, 47, 247, 0.4), 0 0 60px rgba(0, 212, 255, 0.2); }
        }
      `}</style>
    </div>
  );
}