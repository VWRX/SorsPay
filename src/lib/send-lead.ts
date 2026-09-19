export interface LeadPayload {
  projectName: string;
  site: string;
  projectType: string;
  volume: string;
  telegram: string;
}

const PROJECT_TYPE_LABEL: Record<string, string> = {
  casino: 'Казино',
  bookmaker: 'Букмекерская контора',
  exchange: 'Обменник / крипто-платформа',
  other: 'Другое',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendLeadToTelegram(payload: LeadPayload): Promise<void> {
  const botToken = process.env.NEXT_PUBLIC_TG_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TG_CHAT_ID;

  if (!botToken || !chatId) {
    throw new Error('Telegram config missing');
  }

  const now = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const projectName = escapeHtml(payload.projectName.trim());
  const site = escapeHtml(payload.site.trim());
  const telegram = escapeHtml(payload.telegram.trim());
  const typeLabel = PROJECT_TYPE_LABEL[payload.projectType] ?? payload.projectType;
  const type = escapeHtml(typeLabel);
  const volume = escapeHtml(payload.volume);

  const text = [
    '✅ <b>Новая заявка с лендинга SorsPay</b>',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `📛 <b>Название проекта:</b> ${projectName}`,
    `🌐 <b>Сайт / Telegram-бот:</b> ${site}`,
    `🎯 <b>Тип проекта:</b> ${type}`,
    `💰 <b>Оборот (указан мерчантом):</b> ${volume} млн ₽ / мес`,
    `📱 <b>Связаться с мерчантом:</b> ${telegram}`,
    `🕐 <b>Время заявки:</b> ${now}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '⚡ Ответьте мерчанту в течение 15 минут',
  ].join('\n');

  // Мерчант в telegram уже с @ (по валидации формы)
  const merchantUsername = payload.telegram.trim().replace(/^@/, '');
  const writeUrl = `https://t.me/${merchantUsername}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💬 Написать мерчанту', url: writeUrl },
          ],
          [
            { text: '📋 Скопировать @username', url: writeUrl },
          ],
        ],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.description || 'Telegram send failed');
  }
}