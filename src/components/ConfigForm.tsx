import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Users, FolderOpen, Key, Bug, Zap, Settings } from 'lucide-react';


interface ConfigField {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
  type: 'text' | 'boolean' | 'number';
  group: string;
}


const CONFIG_FIELDS: ConfigField[] = [
  // Файлы и папки - отсортировано по алфавиту
  { key: 'CACHE_FILE_NAME', label: 'Кэш групп', description: 'Файл для кэширования данных ВК групп', defaultValue: 'vk_group_cache.json', type: 'text', group: 'files' },
  { key: 'CHANNEL_PROTECTION_LIST_FILE_NAME', label: 'Защищенные каналы', description: 'Список защищенных каналов', defaultValue: 'protected_channels.json', type: 'text', group: 'files' },
  { key: 'DATA_FOLDER', label: 'Папка данных', description: 'Основная папка для хранения данных', defaultValue: 'data', type: 'text', group: 'files' },
  { key: 'DATABASE_FILE_NAME', label: 'База данных постов', description: 'База данных обработанных постов', defaultValue: 'processed_posts.db', type: 'text', group: 'files' },
  { key: 'LIVE_CACHE_FILE_NAME', label: 'Кэш стримов', description: 'Кэш для данных о прямых трансляциях', defaultValue: 'vk_Live_cache.json', type: 'text', group: 'files' },
  { key: 'LIVE_DATABASE_FILE_NAME', label: 'База данных стримов', description: 'База данных для отслеживания стримов', defaultValue: 'vk_live.db', type: 'text', group: 'files' },
  { key: 'LOG_FILE_NAME', label: 'Файл логов', description: 'Файл для записи логов работы бота', defaultValue: 'bot.log', type: 'text', group: 'files' },
  { key: 'PDF_CACHE_FILE_NAME', label: 'Кэш PDF', description: 'Файл для кэширования данных PDF', defaultValue: 'pdf_cache.json', type: 'text', group: 'files' },
  { key: 'TELEGRAM_CACHE_FILE_NAME', label: 'Кэш Telegram', description: 'Файл для кэширования данных Telegram', defaultValue: 'telegram_cache.json', type: 'text', group: 'files' },
  { key: 'TRELLO_CACHE_FILE_NAME', label: 'Кэш Trello', description: 'Файл для кэширования данных Trello', defaultValue: 'trello_cache.json', type: 'text', group: 'files' },
  { key: 'VOICE_CHANNEL_FILE_NAME', label: 'Защищенные голосовые каналы', description: 'Список защищенных голосовых каналов', defaultValue: 'protected_channels_voice.json', type: 'text', group: 'files' },

  // ID каналов и ролей - отсортировано по алфавиту
  { key: 'BAN_ROLE_ID', label: 'ID роли бана', description: 'ID роли для забаненных пользователей', defaultValue: '1428698132438319205', type: 'text', group: 'tokens' },
  { key: 'DISCORD_BOT_TOKEN', label: 'Токен бота Discord', description: 'Токен для авторизации Discord бота', defaultValue: '', type: 'text', group: 'tokens' },
  { key: 'DISCORD_SOURCE_CHANNEL_ID', label: 'ID исходного канала Discord', description: 'Discord канал для мониторинга', defaultValue: '1314901028209954867', type: 'text', group: 'tokens' },
  { key: 'EXTRA_IGNORE_ROLE_ID', label: 'ID роли игнорирования', description: 'ID роли для игнорирования в дополнительном модуле', defaultValue: '1425073025119944804', type: 'text', group: 'tokens' },
  { key: 'EXTRA_STATUS_CHANNEL_ID', label: 'ID канала дополнительного статуса', description: 'Discord канал для дополнительных уведомлений', defaultValue: '1425045963348770856', type: 'text', group: 'tokens' },
  { key: 'GLOBAL_LOG_CHANNEL_ID', label: 'ID канала глобальных логов', description: 'Discord канал для записи всех логов', defaultValue: '1403729214255140955', type: 'text', group: 'tokens' },
  { key: 'PDF_CHANNEL_ID', label: 'ID канала PDF', description: 'Discord канал для уведомлений о PDF', defaultValue: '1426974340829937664', type: 'text', group: 'tokens' },
  { key: 'PDF_MENTION_ROLE_ID', label: 'ID роли упоминания PDF', description: 'ID роли для упоминания при обновлениях PDF', defaultValue: '1148137082867429456', type: 'text', group: 'tokens' },
  { key: 'RESTORE_ROLE_ID', label: 'ID роли куратора', description: 'ID роли для восстановления доступа', defaultValue: '1412061713217359916', type: 'text', group: 'tokens' },
  { key: 'SERVER_ID', label: 'ID сервера Discord', description: 'Идентификатор Discord сервера', defaultValue: '835802952521351180', type: 'text', group: 'tokens' },
  { key: 'STARTER_ROLE_ID', label: 'ID начальной роли', description: 'ID роли для новых пользователей', defaultValue: '1183737126769143909', type: 'text', group: 'tokens' },
  { key: 'TELEGRAM_BOT_TOKEN', label: 'Токен бота Telegram', description: 'Токен для авторизации Telegram бота', defaultValue: '', type: 'text', group: 'tokens' },
  { key: 'TELEGRAM_CHANNEL_ID', label: 'ID канала Telegram', description: 'ID канала Telegram для мониторинга', defaultValue: '@FromRussiaDiv2', type: 'text', group: 'tokens' },
  { key: 'TELEGRAM_EXCLUDED_VOICE_CHANNELS', label: 'Исключенные голосовые каналы Telegram', description: 'Список ID голосовых каналов, которые нужно игнорировать (через запятую)', defaultValue: '1111694334182563901,1064867508647116881,1275714782267183114', type: 'text', group: 'tokens' },
  { key: 'TELEGRAM_THREAD_ID', label: 'ID треда Telegram', description: 'ID треда в канале Telegram', defaultValue: '183', type: 'text', group: 'tokens' },
  { key: 'VK_TOKEN', label: 'Токен VK', description: 'Токен для API ВКонтакте', defaultValue: '', type: 'text', group: 'tokens' },

  // Настройки отладки - отсортировано по алфавиту
  { key: 'DEBUG', label: 'Режим отладки', description: 'Включить подробные логи для отладки', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_CONSOLE', label: 'Отключить эмодзи в консоли', description: 'Убрать эмодзи из вывода в консоль', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_DISCORD', label: 'Отключить эмодзи в Discord', description: 'Убрать эмодзи из сообщений Discord', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_FILE', label: 'Отключить эмодзи в файлах', description: 'Убрать эмодзи при записи в файлы', defaultValue: 'true', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_KEYBOARD_INTERRUPT', label: 'Отключить прерывание с клавиатуры', description: 'Игнорировать Ctrl+C и подобные команды', defaultValue: 'true', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_LOGGER', label: 'Отключить логгер', description: 'Полностью отключить систему логирования', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'FULL_LOG_EXTRA', label: 'Полное логирование дополнительного модуля', description: 'Включить подробное логирование дополнительного модуля', defaultValue: 'false', type: 'boolean', group: 'debug' },

  // Функциональность - отсортировано по алфавиту
  { key: 'DISABLE_CHAT_IN_VOICE', label: 'Отключить чат в голосовых каналах', description: 'Запретить писать в чат голосовых каналов', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_DISCORD_CHANNEL_PROTECTION', label: 'Защита каналов Discord', description: 'Включить защиту определенных каналов', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_EXTRA_MODULE', label: 'Дополнительный модуль', description: 'Активировать расширенную функциональность', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_LIVE_MONITORING', label: 'Мониторинг стримов', description: 'Отслеживать прямые трансляции', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_PDF_MONITOR_MODULE', label: 'Модуль мониторинга PDF', description: 'Включить отслеживание обновлений PDF', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_POST_MONITORING', label: 'Мониторинг постов', description: 'Отслеживать новые посты в группах', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_ROLE_CLEANER_MODULE', label: 'Модуль очистки ролей', description: 'Включить автоматическую очистку ролей', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_TELEGRAM_MODULE', label: 'Модуль Telegram', description: 'Включить интеграцию с Telegram', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_TRELLO_MODULE', label: 'Модуль Trello', description: 'Включить интеграцию с Trello', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'PDF_CHECK_INTERVAL', label: 'Интервал проверки PDF (секунды)', description: 'Как часто проверять обновления PDF', defaultValue: '1800', type: 'number', group: 'features' },
  { key: 'PDF_MONITOR_URL', label: 'URL мониторинга PDF', description: 'URL для мониторинга PDF документов', defaultValue: 'https://division.inot.pro/', type: 'text', group: 'features' },
  { key: 'ROLE_CLEANER_USE_EVENTS', label: 'Использовать события для очистки ролей', description: 'Использовать события Discord вместо периодических проверок', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'TELEGRAM_MONITOR_ALL_VOICE_CHANNELS', label: 'Мониторить все голосовые каналы в Telegram', description: 'Отслеживать все голосовые каналы или только указанные', defaultValue: 'true', type: 'boolean', group: 'features' },

  // Настройки Discord - только режим логирования
  { key: 'DISCORD_LOG_MODE', label: 'Режим логирования Discord', description: 'Уровень детализации логов', defaultValue: 'all', type: 'text', group: 'discord' },

  // Прочие настройки - отсортировано по алфавиту
  { key: 'INTENTS_MEMBERS', label: 'Intent: Члены сервера', description: 'Разрешить боту получать информацию о членах сервера', defaultValue: 'true', type: 'boolean', group: 'misc' },
  { key: 'INTENTS_MESSAGE_CONTENT', label: 'Intent: Содержимое сообщений', description: 'Разрешить боту читать содержимое сообщений', defaultValue: 'true', type: 'boolean', group: 'misc' },
  { key: 'INTENTS_PRESENCES', label: 'Intent: Присутствие', description: 'Разрешить боту отслеживать онлайн статус', defaultValue: 'true', type: 'boolean', group: 'misc' },
  { key: 'INTENTS_VOICE_STATES', label: 'Intent: Голосовые состояния', description: 'Разрешить боту отслеживать подключения к голосовым каналам', defaultValue: 'true', type: 'boolean', group: 'misc' },
  { key: 'JSON_ENSURE_ASCII', label: 'Принудительный ASCII в JSON', description: 'Кодировать все символы в ASCII при записи JSON', defaultValue: 'false', type: 'boolean', group: 'misc' },
  { key: 'JSON_INDENT', label: 'Отступ в JSON', description: 'Количество пробелов для форматирования JSON', defaultValue: '2', type: 'number', group: 'misc' },
  { key: 'LIVE_RETENTION_DAYS', label: 'Дни хранения данных стримов', description: 'Сколько дней хранить данные о стримах', defaultValue: '30', type: 'number', group: 'misc' },
  { key: 'LOG_FILE_ENCODING', label: 'Кодировка файла логов', description: 'Кодировка для записи логов', defaultValue: 'utf-8', type: 'text', group: 'misc' },
  { key: 'MENTION_STARTUP_ROLE', label: 'Упоминать роль при запуске', description: 'Упоминать роль куратора при запуске бота', defaultValue: 'false', type: 'boolean', group: 'misc' },
  { key: 'RETENTION_DAYS', label: 'Дни хранения основных данных', description: 'Сколько дней хранить обработанные посты', defaultValue: '30', type: 'number', group: 'misc' },
  { key: 'ROLE_CLEANER_CHECK_INTERVAL', label: 'Интервал очистки ролей (секунды)', description: 'Как часто проверять и очищать роли', defaultValue: '60', type: 'number', group: 'misc' },
  { key: 'TIMEZONE_REGION', label: 'Часовой пояс', description: 'Регион для определения времени', defaultValue: 'Europe/Moscow', type: 'text', group: 'misc' },
  { key: 'TRELLO_POLL_INTERVAL', label: 'Интервал опроса Trello (секунды)', description: 'Как часто проверять обновления в Trello', defaultValue: '1800', type: 'number', group: 'misc' },
  { key: 'USE_AUTO_RESTART', label: 'Автоматический перезапуск', description: 'Автоматически перезапускать бота при критических ошибках', defaultValue: 'true', type: 'boolean', group: 'misc' },
  { key: 'USE_GROUP_AVATAR_AS_DEFAULT', label: 'Аватар группы как основной', description: 'Использовать аватар ВК группы вместо стандартного', defaultValue: 'false', type: 'boolean', group: 'misc' },
  { key: 'USE_GROUP_COVER_AS_PREVIEW', label: 'Обложка группы как превью', description: 'Использовать обложку группы для предпросмотра', defaultValue: 'false', type: 'boolean', group: 'misc' },
];

const GROUP_NAMES = {
  files: 'Файлы и папки',
  tokens: 'ID каналов и ролей',
  debug: 'Настройки отладки',
  features: 'Функциональность',
  discord: 'Настройки Discord',
  misc: 'Прочие настройки'
};

const GROUP_ICONS = {
  files: FolderOpen,
  tokens: Key,
  debug: Bug,
  features: Zap,
  discord: MessageCircle,
  misc: Settings
};

export const ConfigForm = () => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    CONFIG_FIELDS.forEach(field => {
      initialData[field.key] = field.defaultValue;
    });
    return initialData;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  const validateNumberField = (value: string): boolean => {
    // Проверяем, что строка содержит только цифры
    return /^\d+$/.test(value);
  };

  const handleInputChange = (key: string, value: string) => {
    const field = CONFIG_FIELDS.find(f => f.key === key);
    
    // Валидация для числовых полей
    if (field?.type === 'number') {
      if (value === '') {
        setErrors(prev => ({ ...prev, [key]: '' }));
        setFormData(prev => ({ ...prev, [key]: value }));
        return;
      }
      
      if (!validateNumberField(value)) {
        setErrors(prev => ({ 
          ...prev, 
          [key]: 'Поле должно содержать только цифры' 
        }));
        return;
      } else {
        setErrors(prev => ({ ...prev, [key]: '' }));
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateConfigFile = () => {
    // Функция для добавления расширений к файлам
    const addFileExtension = (key: string, value: string) => {
      const fileExtensions: Record<string, string> = {
        'CACHE_FILE_NAME': '.json',
        'CHANNEL_PROTECTION_LIST_FILE_NAME': '.json',
        'DATABASE_FILE_NAME': '.db',
        'LOG_FILE_NAME': '.log',
        'LIVE_CACHE_FILE_NAME': '.json',
        'LIVE_DATABASE_FILE_NAME': '.db'
      };
      
      if (fileExtensions[key]) {
        return value + fileExtensions[key];
      }
      return value;
    };
    
    // Создаем массив всех параметров конфигурации
    const allConfigEntries = [
      // Добавляем токены с пустыми значениями
      'DISCORD_BOT_TOKEN=""',
      'VK_TOKEN=""',
      // Добавляем Discord intents с фиксированными значениями true
      'INTENTS_MEMBERS="true"',
      'INTENTS_MESSAGE_CONTENT="true"',
      'INTENTS_PRESENCES="true"',
      'INTENTS_VOICE_STATES="true"',
      // Добавляем остальные поля
      ...CONFIG_FIELDS.map(field => {
        const value = field.group === 'files' 
          ? addFileExtension(field.key, formData[field.key])
          : formData[field.key];
        return `${field.key}="${value}"`;
      })
    ];
    
    // Используем CRLF для Windows
    const configContent = allConfigEntries.join('\r\n');

    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Файл создан!",
      description: "Конфигурационный файл .env успешно скачан.",
    });
  };

  const resetToDefaults = () => {
    const defaultData: Record<string, string> = {};
    CONFIG_FIELDS.forEach(field => {
      defaultData[field.key] = field.defaultValue;
    });
    setFormData(defaultData);
    
    toast({
      title: "Сброшено",
      description: "Все настройки возвращены к значениям по умолчанию.",
    });
  };

  const groupedFields = CONFIG_FIELDS.reduce((acc, field) => {
    if (!acc[field.group]) {
      acc[field.group] = [];
    }
    acc[field.group].push(field);
    return acc;
  }, {} as Record<string, ConfigField[]>);


  return (
    <div className="container mx-auto p-6">
      {/* Header with Bot Name and Logos */}
      <div className="text-center space-y-6 mb-12">
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* VK Logo */}
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">VKontakte</span>
          </div>
          
          {/* Bot Name */}
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
              VиКтория
            </h1>
            <p className="text-lg font-medium text-primary">VK/Discord Bot</p>
          </div>
          
          {/* Discord Logo */}
          <div className="flex items-center space-x-2 text-indigo-600">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Discord</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Генератор конфигурации
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Создайте файл конфигурации для вашего бота VиКтория. Заполните необходимые поля и скачайте готовый файл настроек.
        </p>
      </div>

      <div className="flex gap-4 justify-center mb-8">
        <Button onClick={resetToDefaults} variant="outline">
          Сбросить к умолчанию
        </Button>
        <Button onClick={generateConfigFile} variant="download" size="lg">
          Скачать конфигурацию
        </Button>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="space-y-6">
        {Object.entries(groupedFields).map(([groupKey, fields]) => {
          const IconComponent = GROUP_ICONS[groupKey as keyof typeof GROUP_ICONS];
          return (
          <Card key={groupKey}>
            <CardHeader>
              <CardTitle className="text-xl border-b-4 border-red-600 pb-2 inline-block flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                {GROUP_NAMES[groupKey as keyof typeof GROUP_NAMES]}
              </CardTitle>
              <CardDescription>
                Настройки для {GROUP_NAMES[groupKey as keyof typeof GROUP_NAMES].toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <p className="text-xs font-mono text-primary font-semibold">
                      {field.key}
                    </p>
                    {field.type === 'boolean' ? (
                      <select
                        id={field.key}
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="true">Включено (true)</option>
                        <option value="false">Отключено (false)</option>
                      </select>
                    ) : field.key === 'DISCORD_LOG_MODE' ? (
                      <select
                        id={field.key}
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="all">all</option>
                        <option value="errors_only">errors_only</option>
                        <option value="disabled">disabled</option>
                      </select>
                    ) : field.key === 'LOG_FILE_ENCODING' ? (
                      <select
                        id={field.key}
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <optgroup label="Unicode">
                          <option value="utf-8">UTF-8 (универсальная)</option>
                          <option value="utf-16">UTF-16</option>
                          <option value="utf-16le">UTF-16 LE</option>
                          <option value="utf-16be">UTF-16 BE</option>
                          <option value="utf-32">UTF-32</option>
                        </optgroup>
                        <optgroup label="Кириллица">
                          <option value="windows-1251">Windows-1251 (CP1251)</option>
                          <option value="koi8-r">KOI8-R</option>
                          <option value="koi8-u">KOI8-U</option>
                          <option value="cp866">CP866 (DOS)</option>
                          <option value="iso-8859-5">ISO-8859-5</option>
                        </optgroup>
                        <optgroup label="Западноевропейские">
                          <option value="windows-1252">Windows-1252 (CP1252)</option>
                          <option value="iso-8859-1">ISO-8859-1 (Latin-1)</option>
                          <option value="iso-8859-15">ISO-8859-15 (Latin-9)</option>
                        </optgroup>
                        <optgroup label="Азиатские">
                          <option value="gb2312">GB2312 (китайская упрощенная)</option>
                          <option value="gbk">GBK (китайская расширенная)</option>
                          <option value="big5">Big5 (китайская традиционная)</option>
                          <option value="shift_jis">Shift JIS (японская)</option>
                          <option value="euc-jp">EUC-JP (японская)</option>
                          <option value="euc-kr">EUC-KR (корейская)</option>
                        </optgroup>
                        <optgroup label="Прочие">
                          <option value="ascii">ASCII</option>
                          <option value="latin1">Latin-1</option>
                          <option value="cp437">CP437</option>
                          <option value="iso-8859-2">ISO-8859-2 (центральноевропейская)</option>
                        </optgroup>
                      </select>
                    ) : field.key === 'TIMEZONE_REGION' ? (
                      <select
                        id={field.key}
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <optgroup label="Европа">
                          <option value="Europe/London">Лондон (UTC+0/UTC+1)</option>
                          <option value="Europe/Dublin">Дублин (UTC+0/UTC+1)</option>
                          <option value="Europe/Lisbon">Лиссабон (UTC+0/UTC+1)</option>
                          <option value="Europe/Berlin">Берлин (UTC+1/UTC+2)</option>
                          <option value="Europe/Paris">Париж (UTC+1/UTC+2)</option>
                          <option value="Europe/Rome">Рим (UTC+1/UTC+2)</option>
                          <option value="Europe/Madrid">Мадрид (UTC+1/UTC+2)</option>
                          <option value="Europe/Amsterdam">Амстердам (UTC+1/UTC+2)</option>
                          <option value="Europe/Brussels">Брюссель (UTC+1/UTC+2)</option>
                          <option value="Europe/Vienna">Вена (UTC+1/UTC+2)</option>
                          <option value="Europe/Prague">Прага (UTC+1/UTC+2)</option>
                          <option value="Europe/Warsaw">Варшава (UTC+1/UTC+2)</option>
                          <option value="Europe/Budapest">Будапешт (UTC+1/UTC+2)</option>
                          <option value="Europe/Zurich">Цюрих (UTC+1/UTC+2)</option>
                          <option value="Europe/Stockholm">Стокгольм (UTC+1/UTC+2)</option>
                          <option value="Europe/Oslo">Осло (UTC+1/UTC+2)</option>
                          <option value="Europe/Copenhagen">Копенгаген (UTC+1/UTC+2)</option>
                          <option value="Europe/Helsinki">Хельсинки (UTC+2/UTC+3)</option>
                          <option value="Europe/Tallinn">Таллин (UTC+2/UTC+3)</option>
                          <option value="Europe/Riga">Рига (UTC+2/UTC+3)</option>
                          <option value="Europe/Vilnius">Вильнюс (UTC+2/UTC+3)</option>
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/Kiev">Киев (UTC+2/UTC+3)</option>
                          <option value="Europe/Kyiv">Киев (UTC+2/UTC+3)</option>
                          <option value="Europe/Minsk">Минск (UTC+3)</option>
                          <option value="Europe/Bucharest">Бухарест (UTC+2/UTC+3)</option>
                          <option value="Europe/Sofia">София (UTC+2/UTC+3)</option>
                          <option value="Europe/Athens">Афины (UTC+2/UTC+3)</option>
                          <option value="Europe/Istanbul">Стамбул (UTC+3)</option>
                        </optgroup>
                        <optgroup label="Азия">
                          <option value="Asia/Tokyo">Токио (UTC+9)</option>
                          <option value="Asia/Seoul">Сеул (UTC+9)</option>
                          <option value="Asia/Shanghai">Шанхай (UTC+8)</option>
                          <option value="Asia/Beijing">Пекин (UTC+8)</option>
                          <option value="Asia/Hong_Kong">Гонконг (UTC+8)</option>
                          <option value="Asia/Taipei">Тайбэй (UTC+8)</option>
                          <option value="Asia/Singapore">Сингапур (UTC+8)</option>
                          <option value="Asia/Kuala_Lumpur">Куала-Лумпур (UTC+8)</option>
                          <option value="Asia/Bangkok">Бангкок (UTC+7)</option>
                          <option value="Asia/Jakarta">Джакарта (UTC+7)</option>
                          <option value="Asia/Ho_Chi_Minh">Хошимин (UTC+7)</option>
                          <option value="Asia/Manila">Манила (UTC+8)</option>
                          <option value="Asia/Dhaka">Дакка (UTC+6)</option>
                          <option value="Asia/Kolkata">Калькутта (UTC+5:30)</option>
                          <option value="Asia/Kathmandu">Катманду (UTC+5:45)</option>
                          <option value="Asia/Karachi">Карачи (UTC+5)</option>
                          <option value="Asia/Tashkent">Ташкент (UTC+5)</option>
                          <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                          <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                          <option value="Asia/Irkutsk">Иркутск (UTC+8)</option>
                          <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                          <option value="Asia/Kamchatka">Камчатка (UTC+12)</option>
                          <option value="Asia/Dubai">Дубай (UTC+4)</option>
                          <option value="Asia/Qatar">Катар (UTC+3)</option>
                          <option value="Asia/Riyadh">Эр-Рияд (UTC+3)</option>
                          <option value="Asia/Baghdad">Багдад (UTC+3)</option>
                          <option value="Asia/Tehran">Тегеран (UTC+3:30/UTC+4:30)</option>
                          <option value="Asia/Jerusalem">Иерусалим (UTC+2/UTC+3)</option>
                        </optgroup>
                        <optgroup label="Северная Америка">
                          <option value="America/New_York">Нью-Йорк (UTC-5/UTC-4)</option>
                          <option value="America/Chicago">Чикаго (UTC-6/UTC-5)</option>
                          <option value="America/Denver">Денвер (UTC-7/UTC-6)</option>
                          <option value="America/Los_Angeles">Лос-Анджелес (UTC-8/UTC-7)</option>
                          <option value="America/Phoenix">Финикс (UTC-7)</option>
                          <option value="America/Anchorage">Анкоридж (UTC-9/UTC-8)</option>
                          <option value="America/Honolulu">Гонолулу (UTC-10)</option>
                          <option value="America/Toronto">Торонто (UTC-5/UTC-4)</option>
                          <option value="America/Vancouver">Ванкувер (UTC-8/UTC-7)</option>
                          <option value="America/Mexico_City">Мехико (UTC-6/UTC-5)</option>
                        </optgroup>
                        <optgroup label="Южная Америка">
                          <option value="America/Sao_Paulo">Сан-Паулу (UTC-3/UTC-2)</option>
                          <option value="America/Buenos_Aires">Буэнос-Айрес (UTC-3)</option>
                          <option value="America/Lima">Лима (UTC-5)</option>
                          <option value="America/Bogota">Богота (UTC-5)</option>
                          <option value="America/Santiago">Сантьяго (UTC-4/UTC-3)</option>
                          <option value="America/Caracas">Каракас (UTC-4)</option>
                        </optgroup>
                        <optgroup label="Африка">
                          <option value="Africa/Cairo">Каир (UTC+2/UTC+3)</option>
                          <option value="Africa/Johannesburg">Йоханнесбург (UTC+2)</option>
                          <option value="Africa/Lagos">Лагос (UTC+1)</option>
                          <option value="Africa/Casablanca">Касабланка (UTC+0/UTC+1)</option>
                          <option value="Africa/Nairobi">Найроби (UTC+3)</option>
                          <option value="Africa/Addis_Ababa">Аддис-Абеба (UTC+3)</option>
                        </optgroup>
                        <optgroup label="Австралия и Океания">
                          <option value="Australia/Sydney">Сидней (UTC+10/UTC+11)</option>
                          <option value="Australia/Melbourne">Мельбурн (UTC+10/UTC+11)</option>
                          <option value="Australia/Brisbane">Брисбен (UTC+10)</option>
                          <option value="Australia/Perth">Перт (UTC+8)</option>
                          <option value="Australia/Adelaide">Аделаида (UTC+9:30/UTC+10:30)</option>
                          <option value="Pacific/Auckland">Окленд (UTC+12/UTC+13)</option>
                          <option value="Pacific/Fiji">Фиджи (UTC+12/UTC+13)</option>
                          <option value="Pacific/Guam">Гуам (UTC+10)</option>
                          <option value="Pacific/Honolulu">Гонолулу (UTC-10)</option>
                        </optgroup>
                        <optgroup label="UTC и прочие">
                          <option value="Etc/UTC">UTC</option>
                          <option value="UTC">UTC</option>
                          <option value="Etc/GMT">GMT</option>
                          <option value="Etc/GMT+1">GMT-1</option>
                          <option value="Etc/GMT+2">GMT-2</option>
                          <option value="Etc/GMT+3">GMT-3</option>
                          <option value="Etc/GMT+4">GMT-4</option>
                          <option value="Etc/GMT+5">GMT-5</option>
                          <option value="Etc/GMT+6">GMT-6</option>
                          <option value="Etc/GMT+7">GMT-7</option>
                          <option value="Etc/GMT+8">GMT-8</option>
                          <option value="Etc/GMT+9">GMT-9</option>
                          <option value="Etc/GMT+10">GMT-10</option>
                          <option value="Etc/GMT+11">GMT-11</option>
                          <option value="Etc/GMT+12">GMT-12</option>
                          <option value="Etc/GMT-1">GMT+1</option>
                          <option value="Etc/GMT-2">GMT+2</option>
                          <option value="Etc/GMT-3">GMT+3</option>
                          <option value="Etc/GMT-4">GMT+4</option>
                          <option value="Etc/GMT-5">GMT+5</option>
                          <option value="Etc/GMT-6">GMT+6</option>
                          <option value="Etc/GMT-7">GMT+7</option>
                          <option value="Etc/GMT-8">GMT+8</option>
                          <option value="Etc/GMT-9">GMT+9</option>
                          <option value="Etc/GMT-10">GMT+10</option>
                          <option value="Etc/GMT-11">GMT+11</option>
                          <option value="Etc/GMT-12">GMT+12</option>
                          <option value="Etc/GMT-13">GMT+13</option>
                          <option value="Etc/GMT-14">GMT+14</option>
                        </optgroup>
                      </select>
                    ) : (
                      <div className="space-y-1">
                        <Input
                          id={field.key}
                          type={field.type === 'number' ? 'text' : 'text'}
                          value={formData[field.key]}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.description}
                          className={errors[field.key] ? 'border-red-500' : ''}
                        />
                        {errors[field.key] && (
                          <p className="text-xs text-red-500">{errors[field.key]}</p>
                        )}
                      </div>
                    )}
                    {!errors[field.key] && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        })}
        
        <div className="text-center pt-8">
          <Button onClick={generateConfigFile} variant="download" size="lg">
            Скачать готовый файл конфигурации
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};