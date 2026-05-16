import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Mic, 
  FileAudio, 
  History, 
  Database,
  Code,
  Copy,
  Terminal
} from 'lucide-react';

const App = () => {
  const [token, setToken] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'check', or 'docs'
  const [historyPage, setHistoryPage] = useState(1);
  const HISTORY_PAGE_SIZE = 20;

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const uploadAudio = async () => {
    if (!file || !token) {
      setError('تکایە فایلێک و تۆکنەکەت دیاری بکە');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`https://asr.bla.iq/audio-fil?current_user=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'accept': 'application/json' },
        body: formData,
      });

      if (!response.ok) throw new Error('کێشەیەک لە سێرڤەر هەیە');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('نەتوانرا فایلەکە بنێردرێت: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkBalance = async () => {
    if (!token) {
      setError('تکایە سەرەتا تۆکنەکە بنووسە');
      return;
    }

    setLoading(true);
    setBalance(null);
    setError(null);

    try {
      const response = await fetch(`https://asr.bla.iq/check/${encodeURIComponent(token)}`, {
        headers: { 'accept': 'application/json' },
      });

      if (!response.ok) throw new Error('تۆکنەکە نادروستە یان کێشەیەک هەیە');

      const data = await response.json();
      setBalance(data);
    } catch (err) {
      setError('هەڵە لە وەرگرتنی زانیاری: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-right font-sans p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-200">
              <Mic size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">ASR API Tester</h1>
              <p className="text-slate-500 text-sm">تاقیکردنەوە و دۆکیومێنتەیشنی API وەرگێڕانی دەنگ</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full">
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'upload' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
            >
              ناردنی فایل
            </button>
            <button 
              onClick={() => setActiveTab('check')}
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'check' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
            >
              پشکنینی باڵانس
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 rounded-md transition-all whitespace-nowrap ${activeTab === 'docs' ? 'bg-white shadow-sm text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
            >
              دۆکیومێنتەیشن
            </button>
          </div>
        </header>

        {/* Token Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <label className="block text-slate-700 font-bold mb-2 flex items-center gap-2">
            <Settings size={18} className="text-slate-400" />
            تۆکنی بەکارهێنەر (Token)
          </label>
          <input 
            type="text" 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-left font-mono text-sm"
            placeholder="تۆکنی تایبەتی خۆت لێرە دابنێ (Token)..."
          />
        </div>

        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
              <div 
                className={`border-2 border-dashed rounded-2xl p-10 transition-all ${file ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <input type="file" id="audio-upload" hidden accept="audio/*" onChange={handleFileChange} />
                <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
                  <div className={`p-4 rounded-full mb-4 ${file ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <FileAudio size={40} />
                  </div>
                  {file ? (
                    <div className="text-slate-800">
                      <p className="font-bold">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-bold text-slate-700">فایلە دەنگییەکە لێرە دابنێ</p>
                      <p className="text-slate-400 mt-1">یان کلیک بکە بۆ هەڵبژاردن (WAV, MP3...)</p>
                    </>
                  )}
                </label>
              </div>
              <button 
                onClick={uploadAudio}
                disabled={loading || !file}
                className={`w-full mt-6 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${loading || !file ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100'}`}
              >
                {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                دەستپێکردنی وەرگێڕان
              </button>
            </div>

            {result && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    ئەنجامی وەرگێڕان
                  </h3>
                  <span className="bg-slate-100 px-3 py-1 rounded-full text-xs text-slate-500">
                    ماوەی دەنگ: {result.audio_duration} چرکە
                  </span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 min-h-[100px] leading-relaxed text-slate-700">
                  {result.text}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                   <StatCard label="چرکەی ماوە" value={result.seconds_left} icon={<Clock size={16}/>} color="blue" />
                   <StatCard label="بەسەرچوون" value={new Date(result.expires_at).toLocaleDateString('ku-IQ')} icon={<AlertCircle size={16}/>} color="orange" />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'check' && (
          <div className="animate-in fade-in duration-300">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center mb-6">
                <Database className="mx-auto text-blue-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-slate-800 mb-2">پشکنینی هەژمار</h3>
                <p className="text-slate-500 mb-6 text-sm">بزانە چەند کاتت ماوە و مێژووی داواکارییەکانت چۆن بووە</p>
                <button 
                  onClick={checkBalance}
                  disabled={loading}
                  className={`px-8 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 mx-auto transition-all ${loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "وەرگرتنی زانیاری"}
                </button>
             </div>

             {balance && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-slate-400 text-xs mb-1 font-bold">کۆی کاتی ماوە</p>
                      <p className="text-2xl font-black text-blue-600" dir="ltr">{balance.time_left}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-slate-400 text-xs mb-1 font-bold">کاتی بەکارهاتوو</p>
                      <p className="text-2xl font-black text-slate-700" dir="ltr">{balance.time_spent}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-slate-400 text-xs mb-1 font-bold">کۆی داواکارییەکان</p>
                      <p className="text-2xl font-black text-slate-700">{balance.total_requests}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <History size={18} className="text-slate-400" />
                        <h4 className="font-bold text-slate-800">مێژووی دوایین کارەکان</h4>
                      </div>
                      <span className="text-xs text-slate-400 bg-white border border-slate-200 px-3 py-1 rounded-full">
                        کۆی {balance.request_history.length} داواکاری
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="text-slate-400 text-sm border-b border-slate-50">
                            <th className="p-4 font-medium text-center">#</th>
                            <th className="p-4 font-medium text-center">ڕێکەوت</th>
                            <th className="p-4 font-medium text-center">ماوە (چرکە)</th>
                            <th className="p-4 font-medium text-center">ناونیشانی IP</th>
                          </tr>
                        </thead>
                        <tbody>
                          {balance.request_history
                            .slice((historyPage - 1) * HISTORY_PAGE_SIZE, historyPage * HISTORY_PAGE_SIZE)
                            .map((req, i) => (
                              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-300 text-xs text-center font-mono">
                                  {(historyPage - 1) * HISTORY_PAGE_SIZE + i + 1}
                                </td>
                                <td className="p-4 text-slate-600 text-sm text-center">
                                  {new Date(req.timestamp).toLocaleString('ku-IQ')}
                                </td>
                                <td className="p-4 font-mono text-center">{req.duration_seconds}s</td>
                                <td className="p-4 text-slate-400 text-sm text-center">{req.ip}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination Controls */}
                    {balance.request_history.length > HISTORY_PAGE_SIZE && (
                      <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50">
                        <button
                          onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                          disabled={historyPage === 1}
                          className="px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          ← پێشوو
                        </button>
                        <span className="text-sm text-slate-500">
                          پەڕەی <span className="font-bold text-slate-700">{historyPage}</span> لە <span className="font-bold text-slate-700">{Math.ceil(balance.request_history.length / HISTORY_PAGE_SIZE)}</span>
                        </span>
                        <button
                          onClick={() => setHistoryPage(p => Math.min(Math.ceil(balance.request_history.length / HISTORY_PAGE_SIZE), p + 1))}
                          disabled={historyPage === Math.ceil(balance.request_history.length / HISTORY_PAGE_SIZE)}
                          className="px-4 py-2 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          دواتر →
                        </button>
                      </div>
                    )}
                  </div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Code className="text-blue-500" />
                دۆکیومێنتەیشنی گەشەپێدەران
              </h3>
              
              <div className="space-y-8">
                {/* Endpoint 1 */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">POST</span>
                    <h4 className="font-bold text-slate-700">وەرگێڕانی فایلی دەنگی</h4>
                  </div>
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm relative group overflow-x-auto">
                    <button 
                      onClick={() => copyToClipboard(`curl -X 'POST' 'https://asr.bla.iq/audio-fil?current_user=YOUR_TOKEN' -H 'accept: application/json' -H 'Content-Type: multipart/form-data' -F 'file=@audio.wav;type=audio/wav'`)}
                      className="absolute left-2 top-2 p-2 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy size={16} />
                    </button>
                    <pre dir="ltr" className="text-left">
{`curl -X 'POST' \\
  'https://asr.bla.iq/audio-fil?current_user=YOUR_TOKEN' \\
  -H 'accept: application/json' \\
  -H 'Content-Type: multipart/form-data' \\
  -F 'file=@audio.wav;type=audio/wav'`}
                    </pre>
                  </div>
                </section>

                {/* Endpoint 2 */}
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">GET</span>
                    <h4 className="font-bold text-slate-700">پشکنینی باڵانس و هەژمار</h4>
                  </div>
                  <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-sm relative group overflow-x-auto">
                    <button 
                      onClick={() => copyToClipboard(`curl -X 'GET' 'https://asr.bla.iq/check/YOUR_TOKEN' -H 'accept: application/json'`)}
                      className="absolute left-2 top-2 p-2 hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Copy size={16} />
                    </button>
                    <pre dir="ltr" className="text-left">
{`curl -X 'GET' \\
  'https://asr.bla.iq/check/YOUR_TOKEN' \\
  -H 'accept: application/json'`}
                    </pre>
                  </div>
                </section>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                  <h5 className="font-bold text-amber-800 mb-1 flex items-center gap-2">
                    <AlertCircle size={16} />
                    تێبینی گرنگ
                  </h5>
                  <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                    <li>لە جیاتی <code className="bg-amber-100 px-1 rounded">YOUR_TOKEN</code> تۆکنە تایبەتەکەی خۆت بەکاربهێنە.</li>
                    <li>فایلی دەنگی دەبێت قەبارەکەی لە ٢٠ مێگابایت زیاتر نەبێت.</li>
                    <li>سیستەمەکە پشتگیری جۆرەکانی WAV, MP3, OGG دەکات.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 animate-bounce">
            <AlertCircle size={20} />
            <p className="font-bold">{error}</p>
          </div>
        )}

        <footer className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2024 Kurdish ASR API Tester - هەموو مافەکان پارێزراوە</p>
        </footer>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };
  
  return (
    <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${colors[color]}`}>
      <span className="opacity-70">{icon}</span>
      <span className="text-[10px] uppercase font-bold tracking-wider">{label}</span>
      <span className="font-bold text-sm">{value}</span>
    </div>
  );
};

export default App;
