import { useEffect, useMemo, useRef, useState } from 'react';
import { Rotate3D, Play, Pause, RefreshCw } from 'lucide-react';

type Axis = 'x' | 'y';
type PresetKey = 'line' | 'parabola' | 'sqrt' | 'sin' | 'custom';
type ConstructionPhase = 'region' | 'building' | 'solid';

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
	const [phase, setPhase] = useState<ConstructionPhase>('region');
	const [error, setError] = useState('');
	const [cameraAngle, setCameraAngle] = useState(0);
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

	useEffect(() => {
		let frame = 0;
		const rotate = () => {
			setCameraAngle((angle) => angle + 0.006);
			frame = requestAnimationFrame(rotate);
		};
		frame = requestAnimationFrame(rotate);
		return () => cancelAnimationFrame(frame);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !model) return;
		const host = canvas.parentElement;
		if (!host) return;
		const width = Math.max(420, host.clientWidth);
		const height = Math.max(340, Math.min(520, width * 0.62));
		const dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		ctx.scale(dpr, dpr);

		const background = ctx.createLinearGradient(0, 0, width, height);
		background.addColorStop(0, '#071827');
		background.addColorStop(0.55, '#0b1628');
		background.addColorStop(1, '#111827');
		ctx.fillStyle = background;
		ctx.fillRect(0, 0, width, height);

		const centerX = width / 2;
		const centerY = height * 0.52;
		const xMargin = width * 0.12;
		const xScale = (width - xMargin * 2) / Math.max(b - a, 0.001);
		const yScale = height * 0.31 / model.span;
		const depthScale = Math.min(width, height) * 0.11 / model.span;
		const xToScreen = (x: number) => axis === 'x' ? xMargin + (x - a) * xScale : centerX + (x - axisValue) * xScale * 0.42;
		const yToScreen = (y: number) => centerY - (y - (model.top + model.bottom) / 2) * yScale;
		const sweep = phase === 'region' ? 0 : Math.max(0.04, construction) * Math.PI * 2;
		const thetaSteps = 34;

		const project = (x: number, y: number, radius: number, theta: number) => {
			const angle = theta + cameraAngle;
			if (axis === 'x') {
				return {
					x: xMargin + (x - a) * xScale,
					y: yToScreen(axisValue + radius * Math.cos(angle)) + radius * Math.sin(angle) * depthScale,
					depth: Math.sin(angle),
				};
			}
			return {
				x: centerX + radius * Math.cos(angle) * xScale * 0.42,
				y: yToScreen(y) + radius * Math.sin(angle) * depthScale,
				depth: Math.sin(angle),
			};
		};

		// Floor grid gives the volume a stable spatial reference.
		ctx.strokeStyle = 'rgba(100, 116, 139, 0.18)';
		ctx.lineWidth = 1;
		for (let row = 0; row < 6; row += 1) {
			const y = centerY + row * 18;
			ctx.beginPath();
			ctx.moveTo(xMargin, y);
			ctx.lineTo(width - xMargin, y);
			ctx.stroke();
		}
		for (let column = 0; column < 9; column += 1) {
			const x = xMargin + (column / 8) * (width - xMargin * 2);
			ctx.beginPath();
			ctx.moveTo(x, centerY);
			ctx.lineTo(x + (x - centerX) * 0.16, centerY + 95);
			ctx.stroke();
		}

		// Before rotation, show the actual bounded 2D region between f(x) and g(x).
		if (phase === 'region') {
			ctx.beginPath();
			model.points.forEach((point, index) => {
				const x = xMargin + (point.x - a) * xScale;
				const y = yToScreen(point.upper);
				if (index === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			});
			model.points.slice().reverse().forEach((point) => {
				ctx.lineTo(xMargin + (point.x - a) * xScale, yToScreen(point.lower));
			});
			ctx.closePath();
			const regionFill = ctx.createLinearGradient(0, 0, width, 0);
			regionFill.addColorStop(0, 'rgba(45, 212, 191, 0.58)');
			regionFill.addColorStop(1, 'rgba(59, 130, 246, 0.58)');
			ctx.fillStyle = regionFill;
			ctx.fill();
			ctx.strokeStyle = '#67e8f9';
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.setLineDash([8, 6]);
			ctx.strokeStyle = '#fbbf24';
			ctx.lineWidth = 2;
			ctx.beginPath();
			if (axis === 'x') {
				ctx.moveTo(xMargin, yToScreen(axisValue));
				ctx.lineTo(width - xMargin, yToScreen(axisValue));
			} else {
				ctx.moveTo(centerX, 35);
				ctx.lineTo(centerX, height - 44);
			}
			ctx.stroke();
			ctx.setLineDash([]);
			ctx.fillStyle = '#e2e8f0';
			ctx.font = '600 14px sans-serif';
			ctx.fillText('Región plana generadora', 20, 24);
			ctx.fillStyle = '#94a3b8';
			ctx.font = '12px sans-serif';
			ctx.fillText('Pulsa "Construir" para girar esta región', 20, height - 16);
			return;
		}

		// Draw many translucent quadrilateral faces. Their depth-dependent color makes the body read as 3D.
		for (let angleIndex = 0; angleIndex < thetaSteps; angleIndex += 1) {
			const theta = (angleIndex / thetaSteps) * sweep;
			const nextTheta = ((angleIndex + 1) / thetaSteps) * sweep;
			const shade = 0.24 + Math.max(0, Math.sin(theta + cameraAngle)) * 0.42;
			ctx.fillStyle = axis === 'x' ? `rgba(34, 211, 238, ${shade})` : `rgba(167, 139, 250, ${shade})`;
			ctx.strokeStyle = axis === 'x' ? 'rgba(103, 232, 249, 0.22)' : 'rgba(196, 181, 253, 0.22)';
			for (let pointIndex = 0; pointIndex < model.points.length - 1; pointIndex += 1) {
				const current = model.points[pointIndex];
				const next = model.points[pointIndex + 1];
				const currentRadius = axis === 'x' ? Math.max(Math.abs(current.upper - axisValue), Math.abs(current.lower - axisValue)) : Math.abs(current.x - axisValue);
				const nextRadius = axis === 'x' ? Math.max(Math.abs(next.upper - axisValue), Math.abs(next.lower - axisValue)) : Math.abs(next.x - axisValue);
				const p1 = project(current.x, current.upper, currentRadius, theta);
				const p2 = project(next.x, next.upper, nextRadius, theta);
				const p3 = project(next.x, next.upper, nextRadius, nextTheta);
				const p4 = project(current.x, current.upper, currentRadius, nextTheta);
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.lineTo(p3.x, p3.y);
				ctx.lineTo(p4.x, p4.y);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		}

		// Region outline and rotation axis remain visible above the mesh.
		ctx.setLineDash([8, 6]);
		ctx.strokeStyle = '#fbbf24';
		ctx.lineWidth = 2;
		ctx.beginPath();
		if (axis === 'x') {
			ctx.moveTo(xMargin, yToScreen(axisValue));
			ctx.lineTo(width - xMargin, yToScreen(axisValue));
		} else {
			ctx.moveTo(centerX, 35);
			ctx.lineTo(centerX, height - 44);
		}
		ctx.stroke();
		ctx.setLineDash([]);

		ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
		ctx.lineWidth = 1.5;
		ctx.beginPath();
		model.points.forEach((point, index) => {
			const projected = project(point.x, point.upper, axis === 'x' ? Math.abs(point.upper - axisValue) : Math.abs(point.x - axisValue), 0);
			if (index === 0) ctx.moveTo(projected.x, projected.y);
			else ctx.lineTo(projected.x, projected.y);
		});
		ctx.stroke();

		ctx.fillStyle = '#e2e8f0';
		ctx.font = '600 13px sans-serif';
		ctx.fillText(phase === 'building' ? 'Construcción del sólido en progreso' : 'Sólido de revolución terminado', 20, 24);
		ctx.fillStyle = '#94a3b8';
		ctx.font = '12px sans-serif';
		ctx.fillText('La cámara rota lentamente para mostrar profundidad', 20, height - 16);
	}, [model, a, b, axis, axisValue, construction, cameraAngle, phase]);

	const axisLimit = axis === 'x' ? model?.bottom ?? -2 : a - (b - a) * 0.25;
	const axisMax = axis === 'x' ? model?.top ?? 2 : b + (b - a) * 0.25;

	const toggleConstruction = () => {
		if (isPlaying) { setIsPlaying(false); return; }
		setPhase('building');
		setConstruction(0.02);
		setIsPlaying(true);
		let current = 0.02;
		const step = () => {
			current += 0.025;
			if (current >= 1) { setConstruction(1); setPhase('solid'); setIsPlaying(false); return; }
			setConstruction(current);
			requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	};

	const recalculate = () => {
		if (a >= b || !functions) { setError('Revisa las funciones y asegúrate de que a sea menor que b.'); return; }
		setError('');
		setConstruction(0);
		setPhase('region');
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
				<div className="min-w-0 overflow-hidden rounded-xl border border-slate-700/70 bg-[#08111f] p-2">
					{model ? <canvas ref={canvasRef} className="block h-auto w-full rounded-lg" role="img" aria-label="Construcción tridimensional del sólido de revolución" /> : <div className="flex min-h-[360px] items-center justify-center text-sm text-red-200">No se puede construir el sólido con esas funciones.</div>}
					<div className="flex flex-wrap items-center gap-4 px-3 pb-2 pt-1 text-xs text-slate-400"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-cyan-300" />Superficie generada</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-300" />Eje de giro</span><span>{axis === 'x' ? 'Método de arandelas' : 'Método de cascarones'}</span></div>
				</div>
			</div>
		</section>
	);
}
