import React, { useState } from 'react';
import { Task } from '../../types';
import { downloadIcsFile, getGoogleCalendarWebUrl } from '../../utils/calendar';

interface CalendarSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

export const CalendarSyncModal: React.FC<CalendarSyncModalProps> = ({
  isOpen,
  onClose,
  tasks,
}) => {
  const [filterScope, setFilterScope] = useState<'all' | 'today' | 'upcoming'>('all');
  const [copiedTaskLink, setCopiedTaskLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (filterScope === 'today') return t.timeframe === 'today';
    if (filterScope === 'upcoming') return t.timeframe === 'upcoming';
    return true;
  });

  const handleDownloadIcs = () => {
    const filename = `noto-${filterScope}-schedule.ics`;
    downloadIcsFile(filteredTasks, filename);
  };

  const handleCopyGoogleLink = (task: Task) => {
    const url = getGoogleCalendarWebUrl(task);
    navigator.clipboard.writeText(url);
    setCopiedTaskLink(task.id);
    setTimeout(() => setCopiedTaskLink(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        className="w-full max-w-lg bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 shadow-2xl space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              calendar_month
            </span>
            <div>
              <h3 className="text-[16px] font-semibold text-on-surface leading-tight">
                Sinkronisasi Kalender
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Ekspor iCal (.ics) &amp; Google Calendar Web
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scope selector */}
        <div className="flex items-center justify-between shrink-0 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest">
          <button
            type="button"
            onClick={() => setFilterScope('all')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              filterScope === 'all'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant'
            }`}
          >
            Semua Tugas ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('today')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              filterScope === 'today'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant'
            }`}
          >
            Hari Ini ({tasks.filter((t) => t.timeframe === 'today').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterScope('upcoming')}
            className={`flex-1 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
              filterScope === 'upcoming'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant'
            }`}
          >
            Mendatang ({tasks.filter((t) => t.timeframe === 'upcoming').length})
          </button>
        </div>

        {/* Primary Action: Download .ics batch file */}
        <div className="p-4 rounded-xl border-2 border-secondary bg-surface-container-low/60 space-y-3 shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-sm text-on-surface block">
                Unduh File iCalendar (.ics)
              </span>
              <p className="text-[12px] text-on-surface-variant leading-relaxed">
                Kompatibel langsung dengan <strong>Apple Calendar</strong> (iOS &amp; Mac),{' '}
                <strong>Google Calendar</strong>, dan <strong>Microsoft Outlook</strong>.
              </p>
            </div>
            <span className="material-symbols-outlined text-secondary text-[24px]">
              event_available
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadIcs}
            className="w-full py-2.5 px-4 rounded-full bg-secondary text-white font-medium text-[13px] hover:bg-[#2f5541] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Unduh File .ics ({filteredTasks.length} Agenda)</span>
          </button>
        </div>

        {/* Individual tasks Google Calendar Web Sync */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider px-1">
            <span>Sinkron Per Tugas ke Google Calendar (1-Klik)</span>
            <span>Aksi Langsung</span>
          </div>

          {filteredTasks.map((task) => {
            const googleUrl = getGoogleCalendarWebUrl(task);
            return (
              <div
                key={task.id}
                className="p-3 rounded-xl border border-surface-container-highest bg-surface-container-lowest flex items-center justify-between gap-3 hover:border-outline-variant transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-on-surface truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] text-on-surface-variant mt-0.5">
                    <span>{task.durationMin || 45} menit</span>
                    <span>•</span>
                    <span>{task.dueTime || task.time || '14:00'}</span>
                    <span>•</span>
                    <span className="capitalize">{task.priority || 'Medium'}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {/* Open in Google Calendar web */}
                  <a
                    href={googleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg border border-surface-container-highest bg-surface-container-low hover:bg-surface text-[11px] font-semibold text-secondary flex items-center space-x-1 transition-colors cursor-pointer"
                    title="Buka dan simpan langsung di Google Calendar"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    <span>Google Cal</span>
                  </a>

                  {/* Copy Link button */}
                  <button
                    type="button"
                    onClick={() => handleCopyGoogleLink(task)}
                    className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors cursor-pointer"
                    title="Salin URL Google Calendar"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedTaskLink === task.id ? 'check' : 'link'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px] text-on-surface-variant shrink-0">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>Standar Universal RFC 5545</span>
          </span>
          <span>Privat &amp; Berjalan Lokal</span>
        </div>
      </div>
    </div>
  );
};
