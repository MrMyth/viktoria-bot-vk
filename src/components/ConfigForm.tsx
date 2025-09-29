import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Users } from 'lucide-react';

interface ConfigField {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
  type: 'text' | 'boolean' | 'number';
  group: string;
}

const CONFIG_FIELDS: ConfigField[] = [
  // Файлы и папки
  { key: 'CACHE_FILE_NAME', label: 'Имя файла кэша', description: 'Файл для кэширования данных ВК групп', defaultValue: 'vk_group_cache.json', type: 'text', group: 'files' },
  { key: 'CHANNEL_PROTECTION_LIST_FILE_NAME', label: 'Файл защищенных каналов', description: 'JSON файл со списком защищенных каналов', defaultValue: 'protected_channels.json', type: 'text', group: 'files' },
  { key: 'DATABASE_FILE_NAME', label: 'Файл базы данных', description: 'SQLite база данных обработанных постов', defaultValue: 'processed_posts.db', type: 'text', group: 'files' },
  { key: 'DATA_FOLDER', label: 'Папка данных', description: 'Основная папка для хранения данных', defaultValue: 'data', type: 'text', group: 'files' },
  { key: 'LOG_FILE_NAME', label: 'Файл логов', description: 'Файл для записи логов работы бота', defaultValue: 'bot.log', type: 'text', group: 'files' },
  { key: 'LIVE_CACHE_FILE_NAME', label: 'Файл кэша стримов', description: 'Кэш для данных о прямых трансляциях', defaultValue: 'vk_Live_cache.json', type: 'text', group: 'files' },
  { key: 'LIVE_DATABASE_FILE_NAME', label: 'База данных стримов', description: 'База данных для отслеживания стримов', defaultValue: 'vk_live.db', type: 'text', group: 'files' },
  { key: 'STREAM_TOOLS_CONFIG_FILE_NAME', label: 'Конфигурация стрим-инструментов', description: 'Файл настроек для стрим инструментов', defaultValue: 'Apps.json', type: 'text', group: 'files' },

  // Токены и ID
  { key: 'DISCORD_BOT_TOKEN', label: 'Токен Discord бота', description: 'Токен для подключения к Discord API', defaultValue: 'MTQwNzMxNDgyMTA5MDY0NDA2OQ.GzPWsB.2X2xPnsCF7NIJosvpoeQEYqhBbRsanD1pcIwlY', type: 'text', group: 'tokens' },
  { key: 'VK_TOKEN', label: 'Токен ВКонтакте', description: 'Токен для доступа к API ВКонтакте', defaultValue: 'vk1.a.2gPhBcAi-o0mVPmHTiBI34p6pUiHO28w4EkpP3xJmPmGUfgzqK1Mpj7yFUQ0EbKZM_ZEHnJcn1MdvIxsjp5LDl6lQW2RRFEbnZHmEydXFAASwYvU-gRWIr3XXksx8c3wgt7cPAYgebhaD6eb9umAWqDK2ebV2kjOdOMq0NZiGYy3-BnqzUwk_RLapi8psZjSon1HcvyS2AxY_yCcmYPU_Q', type: 'text', group: 'tokens' },
  { key: 'EXTRA_STATUS_CHANNEL_ID', label: 'ID канала дополнительного статуса', description: 'Discord канал для дополнительных уведомлений', defaultValue: '1053619584558714880', type: 'number', group: 'tokens' },
  { key: 'GLOBAL_LOG_CHANNEL_ID', label: 'ID канала глобальных логов', description: 'Discord канал для записи всех логов', defaultValue: '1403729214255140955', type: 'text', group: 'tokens' },
  { key: 'RESTORE_ROLE_ID', label: 'ID роли восстановления', description: 'ID роли для восстановления доступа', defaultValue: '1412061713217359916', type: 'text', group: 'tokens' },
  { key: 'SERVER_ID', label: 'ID сервера Discord', description: 'Идентификатор Discord сервера', defaultValue: '835802952521351180', type: 'text', group: 'tokens' },

  // Настройки отладки
  { key: 'DEBUG', label: 'Режим отладки', description: 'Включить подробные логи для отладки', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_CONSOLE', label: 'Отключить эмодзи в консоли', description: 'Убрать эмодзи из вывода в консоль', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_DISCORD', label: 'Отключить эмодзи в Discord', description: 'Убрать эмодзи из сообщений Discord', defaultValue: 'false', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_EMOJI_FILE', label: 'Отключить эмодзи в файлах', description: 'Убрать эмодзи при записи в файлы', defaultValue: 'true', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_KEYBOARD_INTERRUPT', label: 'Отключить прерывание с клавиатуры', description: 'Игнорировать Ctrl+C и подобные команды', defaultValue: 'true', type: 'boolean', group: 'debug' },
  { key: 'DISABLE_LOGGER', label: 'Отключить логгер', description: 'Полностью отключить систему логирования', defaultValue: 'false', type: 'boolean', group: 'debug' },

  // Функциональность
  { key: 'CUSTOM_MODIFICATIONS', label: 'Пользовательские модификации', description: 'Включить кастомные изменения функционала', defaultValue: 'false', type: 'boolean', group: 'features' },
  { key: 'ENABLE_DISCORD_CHANNEL_PROTECTION', label: 'Защита каналов Discord', description: 'Включить защиту определенных каналов', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_EXTRA_MODULE', label: 'Дополнительный модуль', description: 'Активировать расширенную функциональность', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_LIVE_MONITORING', label: 'Мониторинг стримов', description: 'Отслеживать прямые трансляции', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_POST_MONITORING', label: 'Мониторинг постов', description: 'Отслеживать новые посты в группах', defaultValue: 'true', type: 'boolean', group: 'features' },
  { key: 'ENABLE_STREAM_TOOLS', label: 'Инструменты стрима', description: 'Включить дополнительные инструменты для стримеров', defaultValue: 'false', type: 'boolean', group: 'features' },

  // Настройки Discord
  { key: 'DISCORD_LOG_MODE', label: 'Режим логирования Discord', description: 'Уровень детализации логов (errors_only, all)', defaultValue: 'errors_only', type: 'text', group: 'discord' },
  { key: 'INTENTS_MEMBERS', label: 'Намерения участников', description: 'Доступ к информации об участниках сервера', defaultValue: 'true', type: 'boolean', group: 'discord' },
  { key: 'INTENTS_MESSAGE_CONTENT', label: 'Намерения содержимого сообщений', description: 'Доступ к чтению содержимого сообщений', defaultValue: 'true', type: 'boolean', group: 'discord' },
  { key: 'INTENTS_PRESENCES', label: 'Намерения присутствия', description: 'Отслеживание статуса пользователей', defaultValue: 'true', type: 'boolean', group: 'discord' },
  { key: 'INTENTS_VOICE_STATES', label: 'Намерения голосовых состояний', description: 'Отслеживание голосовых каналов', defaultValue: 'true', type: 'boolean', group: 'discord' },

  // Прочие настройки
  { key: 'JSON_ENSURE_ASCII', label: 'Принудительный ASCII в JSON', description: 'Кодировать все символы в ASCII при записи JSON', defaultValue: 'false', type: 'boolean', group: 'misc' },
  { key: 'JSON_INDENT', label: 'Отступ в JSON', description: 'Количество пробелов для форматирования JSON', defaultValue: '2', type: 'number', group: 'misc' },
  { key: 'LIVE_RETENTION_DAYS', label: 'Дни хранения данных стримов', description: 'Сколько дней хранить данные о стримах', defaultValue: '30', type: 'number', group: 'misc' },
  { key: 'LOG_FILE_ENCODING', label: 'Кодировка файла логов', description: 'Кодировка для записи логов', defaultValue: 'utf-8', type: 'text', group: 'misc' },
  { key: 'LOG_USERNAME', label: 'Имя пользователя в логах', description: 'Отображаемое имя в системе логирования', defaultValue: 'VK-Бот-Логи', type: 'text', group: 'misc' },
  { key: 'RETENTION_DAYS', label: 'Дни хранения основных данных', description: 'Сколько дней хранить обработанные посты', defaultValue: '30', type: 'number', group: 'misc' },
  { key: 'TIMEZONE_REGION', label: 'Часовой пояс', description: 'Регион для определения времени', defaultValue: 'Europe/Moscow', type: 'text', group: 'misc' },
  { key: 'USE_GROUP_AVATAR_AS_DEFAULT', label: 'Аватар группы как основной', description: 'Использовать аватар ВК группы вместо стандартного', defaultValue: 'false', type: 'boolean', group: 'misc' },
  { key: 'USE_GROUP_COVER_AS_PREVIEW', label: 'Обложка группы как превью', description: 'Использовать обложку группы для предпросмотра', defaultValue: 'false', type: 'boolean', group: 'misc' },
];

const GROUP_NAMES = {
  files: 'Файлы и папки',
  tokens: 'Токены и идентификаторы',
  debug: 'Настройки отладки',
  features: 'Функциональность',
  discord: 'Настройки Discord',
  misc: 'Прочие настройки'
};

export const ConfigForm = () => {
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    CONFIG_FIELDS.forEach(field => {
      initialData[field.key] = field.defaultValue;
    });
    return initialData;
  });

  const { toast } = useToast();

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateConfigFile = () => {
    const configContent = CONFIG_FIELDS
      .map(field => `${field.key}="${formData[field.key]}"`)
      .join('\n');

    const blob = new Blob([configContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Файл создан!",
      description: "Конфигурационный файл успешно скачан.",
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
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

      <div className="grid gap-6">
        {Object.entries(groupedFields).map(([groupKey, fields]) => (
          <Card key={groupKey}>
            <CardHeader>
              <CardTitle className="text-xl">{GROUP_NAMES[groupKey as keyof typeof GROUP_NAMES]}</CardTitle>
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
                    ) : (
                      <Input
                        id={field.key}
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={formData[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.description}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <Button onClick={generateConfigFile} variant="download" size="lg">
          Скачать готовый файл конфигурации
        </Button>
      </div>
    </div>
  );
};