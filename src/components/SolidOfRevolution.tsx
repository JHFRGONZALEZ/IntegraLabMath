import { useMemo, useState } from 'react';
import { Rotate3D, Play, Pause, RefreshCw } from 'lucide-react';

type Axis = 'x' | 'y';
type PresetKey = 'line' | 'parabola' | 'sqrt' | 'sin' | 'custom';

interface Preset {
	label: string;
	fn: (x: number) => number;
}

const PRESETS: Record<Exclude<PresetKey, 'custom'>, Preset> = {
	line: { label: 'f(x) = x', fn: (x) => x },
	parabola: { label: 'f(x) = x²', fn: (x) => x * x },
	sqrt: { label: 'f(x) = √x', fn: (x) => Math.sqrt(Math.max(0, x)) },
	sin: { label: 'f(x) = sin(x) + 1', fn: (x) => Math.sin(x) + 1 },
};

function parseFunction(expression: string): ((x: number) => number) | null {
	try {
		const source = expression
			.trim()
			.toLowerCase()
			.replace(/\^/g, '**')
			.replace(/\b(sin|cos|tan|sqrt|log|exp|abs)\b/g, 'Math.$1')
			.replace(/\bpi\b/g, 'Math.PI');
		if (!source) return null;
		const fn = new Function('x', `return ${source}`) as (x: number) => number;
		if (!Number.isFinite(fn(0.5))) return null;
		return fn;
	} catch {
		return null;
	}
}

function integrate(fn: (x: number) => number, a: number, b: number, steps: number): number {
	const h = (b - a) / steps;
	let total = 0;
	for (let i = 0; i <= steps; i += 1) {
		const value = fn(a + i * h);
		if (!Number.isFinite(value)) continue;
		total += (i === 0 || i === steps ? 1 : i % 2 === 0 ? 2 : 4) * value;
	}
	return (h / 3) * total;
}

const formatNumber = (value: number) => value.toFixed(3).replace(/\.000$/, '');

export default function SolidOfRevolution() {
	const [upperKey, setUpperKey] = useState<PresetKey>('line');
	const [lowerKey, setLowerKey] = useState<PresetKey>('parabola');
	const [upperCustom, setUpperCustom] = useState('x');
	const [lowerCustom, setLowerCustom] = useState('x^2');
	const [a, setA] = useState(0);
	const [b, setB] = useState(1);
	const [axis, setAxis] = useState<Axis>('x');
	const [axisValue, setAxisValue] = useState(0);
	const [construction, setConstruction] = useState(0.78);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState('');

	const getFunction = (key: PresetKey, custom: string) => key === 'custom' ? parseFunction(custom) : PRESETS[key].fn;

	const functions = useMemo(() => {
		const upper = getFunction(upperKey, upperCustom);
		const lower = getFunction(lowerKey, lowerCustom);
		return upper && lower && a < b ? { upper, lower } : null;
	}, [upperKey, lowerKey, upperCustom, lowerCustom, a, b]);

	const model = useMemo(() => {
		if (!functions) return null;
		const points = Array.from({ length: 81 }, (_, index) => {
			const x = a + ((b - a) * index) / 80;
			return { x, upper: functions.upper(x), lower: functions.lower(x) };
		}).filter((point) => Number.isFinite(point.upper) && Number.isFinite(point.lower));
		if (points.length < 2) return null;
		const top = Math.max(...points.map((point) => point.upper), ...points.map((point) => point.lower), axisValue, 0);
		const bottom = Math.min(...points.map((point) => point.upper), ...points.map((point) => point.lower), axisValue, 0);
		const span = Math.max(top - bottom, 1);
		const height = (x: number) => Math.max(0, functions.upper(x) - functions.lower(x));
		const volume = axis === 'x'
			? Math.PI * integrate((x) => Math.abs(functions.upper(x) - axisValue) ** 2 - Math.abs(functions.lower(x) - axisValue) ** 2, a, b, 120)
			: 2 * Math.PI * integrate((x) => Math.abs(x - axisValue) * height(x), a, b, 120);
		return { points, top, bottom, span, height, volume: Math.abs(volume) };
	}, [functions, a, b, axis, axisValue]);

	const chart = useMemo(() => {
		if (!model) return null;
		const width = 760;
		const height = 360;
		const plot = { left: 58, right: 28, top: 32, bottom: 42 };
		const plotWidth = width - plot.left - plot.right;
		const plotHeight = height - plot.top - plot.bottom;
		const xScale = (x: number) => plot.left + ((x - a) / (b - a)) * plotWidth;
		const yScale = (y: number) => plot.top + plotHeight - ((y - model.bottom) / model.span) * plotHeight;
		const depthScale = axis === 'x' ? plotHeight / model.span : plotWidth / model.span;
		const angles = Math.max(2, Math.floor(24 * Math.max(0.04, construction)));
		const paths = Array.from({ length: angles + 1 }, (_, angleIndex) => {
			const theta = (angleIndex / 24) * Math.PI * 2;
			return model.points.map((point) => {
				if (axis === 'x') {
					const radius = Math.max(Math.abs(point.upper - axisValue), Math.abs(point.lower - axisValue));
					const y = axisValue + radius * Math.cos(theta);
					const depth = radius * Math.sin(theta) * 0.16;
					return `${xScale(point.x).toFixed(1)},${(yScale(y) + depth * depthScale).toFixed(1)}`;
				}
				const radius = Math.abs(point.x - axisValue);
				const horizontal = axisValue + radius * Math.cos(theta);
				const depth = radius * Math.sin(theta) * 0.22;
				return `${(xScale(horizontal) + depth * depthScale).toFixed(1)},${yScale(point.upper).toFixed(1)}`;
			}).join(' ');
		});
		const upperPath = model.points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xScale(point.x).toFixed(1)} ${yScale(point.upper).toFixed(1)}`).join(' ');
		const lowerPath = model.points.slice().reverse().map((point) => `L ${xScale(point.x).toFixed(1)} ${yScale(point.lower).toFixed(1)}`).join(' ');
		const axisPath = axis === 'x' ? `M ${plot.left} ${yScale(axisValue)} L ${plot.left + plotWidth} ${yScale(axisValue)}` : `M ${xScale(axisValue)} ${plot.top} L ${xScale(axisValue)} ${plot.top + plotHeight}`;
		return { width, height, plot, plotWidth, plotHeight, paths, upperPath, lowerPath, axisPath };
	}, [model, a, b, axis, axisValue, construction]);

	const axisLimit = axis === 'x' ? model?.bottom ?? -2 : a - (b - a) * 0.25;
	const axisMax = axis === 'x' ? model?.top ?? 2 : b + (b - a) * 0.25;

	const toggleConstruction = () => {
		if (isPlaying) { setIsPlaying(false); return; }
		setIsPlaying(true);
		let current = construction;
		const step = () => {
			current += 0.025;
			if (current >= 1) { setConstruction(1); setIsPlaying(false); return; }
			setConstruction(current);
			requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	};

	const recalculate = () => {
		if (a >= b || !functions) { setError('Revisa las funciones y asegúrate de que a sea menor que b.'); return; }
		setError('');
		setConstruction(0.08);
		setIsPlaying(false);
	};

	const presetOptions = Object.entries(PRESETS).map(([key, preset]) => <option key={key} value={key}>{preset.label}</option>);

	return (
		<section className="rounded-2xl border border-cyan-400/25 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/20">
			<div className="mb-5 flex flex-wrap items-start justify-between gap-3">
				<div><div className="mb-2 flex items-center gap-2 text-cyan-300"><Rotate3D size={20} /><span className="text-xs font-bold uppercase tracking-[0.18em]">Laboratorio de sólidos</span></div><h3 className="text-2xl font-bold text-white">Construye un sólido de revolución</h3><p className="mt-1 max-w-3xl text-sm text-slate-400">Cambia las curvas, el intervalo y el eje. Pulsa construir para ver cómo la región gira y forma el sólido.</p></div>
				<div className="rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-right"><p className="text-xs uppercase tracking-wide text-cyan-200">Volumen aproximado</p><p className="text-2xl font-bold text-white">{model ? `${formatNumber(model.volume)} u³` : '--'}</p></div>
			</div>
			<div className="grid gap-5 lg:grid-cols-[280px_1fr]">
				<div className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-800/70 p-4">
					<div><label className="mb-1 block text-xs font-semibold text-cyan-200">Curva superior f(x)</label><select value={upperKey} onChange={(event) => setUpperKey(event.target.value as PresetKey)} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100">{presetOptions}<option value="custom">Personalizada</option></select>{upperKey === 'custom' && <input value={upperCustom} onChange={(event) => setUpperCustom(event.target.value)} placeholder="Ej: sin(x) + 1" className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100" />}</div>
					<div><label className="mb-1 block text-xs font-semibold text-cyan-200">Curva inferior g(x)</label><select value={lowerKey} onChange={(event) => setLowerKey(event.target.value as PresetKey)} className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100">{presetOptions}<option value="custom">Personalizada</option></select>{lowerKey === 'custom' && <input value={lowerCustom} onChange={(event) => setLowerCustom(event.target.value)} placeholder="Ej: x^2" className="mt-2 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100" />}</div>
					<div className="grid grid-cols-2 gap-2"><label className="text-xs text-slate-400">a<input type="number" value={a} step="0.1" onChange={(event) => setA(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-white" /></label><label className="text-xs text-slate-400">b<input type="number" value={b} step="0.1" onChange={(event) => setB(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-900 px-2 py-2 text-sm text-white" /></label></div>
					<div><span className="mb-2 block text-xs font-semibold text-cyan-200">Eje de giro</span><div className="grid grid-cols-2 gap-2"><button onClick={() => { setAxis('x'); setAxisValue(0); }} className={`rounded-lg px-3 py-2 text-sm ${axis === 'x' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>Eje X</button><button onClick={() => { setAxis('y'); setAxisValue(0); }} className={`rounded-lg px-3 py-2 text-sm ${axis === 'y' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>Eje Y</button></div></div>
					<label className="block text-xs text-slate-400">Posición del eje: <span className="font-bold text-white">{formatNumber(axisValue)}</span><input type="range" min={axisLimit} max={axisMax} step="0.05" value={axisValue} onChange={(event) => setAxisValue(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
					<label className="block text-xs text-slate-400">Detalle de construcción<input type="range" min="0.08" max="1" step="0.01" value={construction} onChange={(event) => setConstruction(Number(event.target.value))} className="mt-2 w-full accent-cyan-400" /></label>
					<div className="grid grid-cols-2 gap-2"><button onClick={toggleConstruction} className="flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">{isPlaying ? <Pause size={15} /> : <Play size={15} />}{isPlaying ? 'Pausar' : 'Construir'}</button><button onClick={recalculate} className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-600"><RefreshCw size={15} /> Reiniciar</button></div>
					{error && <p className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-xs text-red-200">{error}</p>}
				</div>
				<div className="min-w-0 rounded-xl border border-slate-700/70 bg-[#08111f] p-2">
					{chart && model ? <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-auto w-full" role="img" aria-label="Construcción visual del sólido de revolución"><defs><linearGradient id="solidFill" x1="0" x2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity=".18" /><stop offset=".5" stopColor="#3b82f6" stopOpacity=".42" /><stop offset="1" stopColor="#a78bfa" stopOpacity=".2" /></linearGradient></defs><rect width={chart.width} height={chart.height} fill="#08111f" /><path d={chart.axisPath} stroke="#fbbf24" strokeWidth="2" strokeDasharray="7 5" />{chart.paths.map((path, index) => <polyline key={index} points={path} fill="none" stroke={index % 2 ? '#60a5fa' : '#22d3ee'} strokeOpacity={0.2 + (index / Math.max(chart.paths.length, 1)) * 0.55} strokeWidth="1.4" />)}<path d={`${chart.upperPath} ${chart.lowerPath} Z`} fill="url(#solidFill)" stroke="#67e8f9" strokeOpacity=".65" strokeWidth="1.5" /><text x="18" y="24" fill="#cbd5e1" fontSize="12">{axis === 'x' ? 'Rotación alrededor de y = ' : 'Rotación alrededor de x = '}{formatNumber(axisValue)}</text><text x="18" y={chart.height - 14} fill="#64748b" fontSize="11">Región generadora entre {formatNumber(a)} y {formatNumber(b)}</text></svg> : <div className="flex min-h-[360px] items-center justify-center text-sm text-red-200">No se puede construir el sólido con esas funciones.</div>}
					<div className="flex flex-wrap items-center gap-4 px-3 pb-2 pt-1 text-xs text-slate-400"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-300" />Superficie generada</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-300" />Eje de giro</span><span>{axis === 'x' ? 'Método de arandelas' : 'Método de cascarones'}</span></div>
				</div>
			</div>
		</section>
	);
}
