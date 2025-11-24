import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ToggleLeft, Clock, Shield, Hash, Calculator, FileText, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ConfigField {
  key: string;
  label: string;
  description: string;
  defaultValue: string;
  type: 'text' | 'boolean' | 'number';
  group: string;
}

const CONFIG_FIELDS: ConfigField[] = [
  // Группа 1: Параметры истина/ложь
  { key: 'DEBUG', label: 'Режим отладки', description: 'Включить подробное логирование', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'DELETE_LINKS', label: 'Удалять ссылки', description: 'Автоматически удалять сообщения со ссылками', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_CHAT_IN_VOICE', label: 'Отключить чат в голосовых', description: 'Запретить писать в чат голосовых каналов', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_EMOJI_CONSOLE', label: 'Отключить эмодзи в консоли', description: 'Убрать эмодзи из вывода в консоль', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_EMOJI_DISCORD', label: 'Отключить эмодзи в Discord', description: 'Убрать эмодзи из сообщений Discord', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_EMOJI_FILE', label: 'Отключить эмодзи в файлах', description: 'Убрать эмодзи при записи в файлы', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_KEYBOARD_INTERRUPT', label: 'Отключить прерывание с клавиатуры', description: 'Игнорировать Ctrl+C', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'DISABLE_LOGGER', label: 'Отключить логгер', description: 'Полностью отключить систему логирования', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'DO_REACTIONS', label: 'Добавлять реакции', description: 'Автоматически добавлять реакции на сообщения', defaultValue: 'false', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_ATTACHMENT_CHECK', label: 'Проверка вложений', description: 'Включить проверку вложений в сообщениях', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_DISCORD_CHANNEL_PROTECTION', label: 'Защита каналов Discord', description: 'Включить защиту определенных каналов', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_EXTRA_MODULE', label: 'Дополнительный модуль', description: 'Активировать расширенную функциональность', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_GLOBAL_LOG', label: 'Глобальное логирование', description: 'Включить отправку логов в глобальный канал', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_LIVE_MONITORING', label: 'Мониторинг стримов', description: 'Отслеживать прямые трансляции', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_PDF_MONITOR_MODULE', label: 'Модуль мониторинга PDF', description: 'Включить отслеживание обновлений PDF', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_POST_MONITORING', label: 'Мониторинг постов', description: 'Отслеживать новые посты в группах', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_ROLE_CLEANER_MODULE', label: 'Модуль очистки ролей', description: 'Включить автоматическую очистку ролей', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_TELEGRAM_MODULE', label: 'Модуль Telegram', description: 'Включить интеграцию с Telegram', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_TRELLO_MODULE', label: 'Модуль Trello', description: 'Включить интеграцию с Trello', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'ENABLE_VIDEO_CHECK', label: 'Проверка видео', description: 'Включить проверку видео в сообщениях', defaultValue: 'true', type: 'boolean', group: 'boolean' },
  { key: 'FULL_LOG_EXTRA', label: 'Полное логирование дополнительного модуля', description: 'Включить подробное логирование', defaultValue: 'false', type: 'boolean', group: 'boolean' },

  // Группа 2: Таймеры и часовой пояс
  { key: 'TELEGRAM_DELAY', label: 'Задержка Telegram (сек)', description: 'Задержка между проверками Telegram', defaultValue: '60', type: 'number', group: 'timers' },
  { key: 'TIMEZONE', label: 'Часовой пояс', description: 'Часовой пояс для временных меток', defaultValue: 'Europe/Moscow', type: 'text', group: 'timers' },
  { key: 'TRELLO_CHECK_INTERVAL', label: 'Интервал проверки Trello (сек)', description: 'Интервал проверки обновлений в Trello', defaultValue: '120', type: 'number', group: 'timers' },
  { key: 'VK_DELAY', label: 'Задержка VK (сек)', description: 'Задержка между проверками VK', defaultValue: '60', type: 'number', group: 'timers' },
  { key: 'VK_LIVE_DELAY', label: 'Задержка VK стримов (сек)', description: 'Задержка между проверками прямых трансляций VK', defaultValue: '300', type: 'number', group: 'timers' },

  // Группа 3: Роли
  { key: 'AUTO_ROLE_ID', label: 'ID автороли', description: 'ID роли, автоматически выдаваемой участникам', defaultValue: '1412061713217359916', type: 'text', group: 'roles' },
  { key: 'BAN_ROLE_ID', label: 'ID роли для забаненных', description: 'ID роли для забаненных участников', defaultValue: '1428698132438319205', type: 'text', group: 'roles' },
  { key: 'PDF_MENTION_ROLE_ID', label: 'ID роли упоминания PDF', description: 'ID роли для упоминания при обновлениях PDF', defaultValue: '1148137082867429456', type: 'text', group: 'roles' },
  { key: 'RESTORE_ROLE_ID', label: 'ID роли куратора', description: 'ID роли для восстановления доступа', defaultValue: '1412061713217359916', type: 'text', group: 'roles' },
  { key: 'STARTER_ROLE_ID', label: 'ID роли для новичков', description: 'ID роли для новых участников', defaultValue: '1183737126769143909', type: 'text', group: 'roles' },

  // Группа 4: Каналы
  { key: 'ANNOUNCEMENTS_CHANNEL_ID', label: 'ID канала объявлений', description: 'ID канала для публикации объявлений', defaultValue: '1288046806991597690', type: 'text', group: 'channels' },
  { key: 'DISCORD_CHANNEL_ID', label: 'ID основного канала Discord', description: 'ID основного Discord канала', defaultValue: '1066654932068950077', type: 'text', group: 'channels' },
  { key: 'DISCORD_LOG_CHANNEL_ID', label: 'ID канала логов Discord', description: 'ID канала для отправки логов Discord', defaultValue: '1214148163823243264', type: 'text', group: 'channels' },
  { key: 'GLOBAL_LOG_CHANNEL_ID', label: 'ID глобального канала логов', description: 'ID канала для глобальных логов', defaultValue: '1214148163823243264', type: 'text', group: 'channels' },
  { key: 'PDF_CHANNEL_ID', label: 'ID канала PDF', description: 'ID канала для публикации PDF документов', defaultValue: '1148137082867429456', type: 'text', group: 'channels' },
  { key: 'TELEGRAM_CHANNEL_ID', label: 'ID канала Telegram', description: 'ID канала Telegram для мониторинга', defaultValue: '@FromRussiaDiv2', type: 'text', group: 'channels' },
  { key: 'TELEGRAM_EXCLUDED_VOICE_CHANNELS', label: 'Исключенные голосовые каналы Discord', description: 'Список ID голосовых каналов (через запятую)', defaultValue: '1111694334182563901,1064867508647116881,1275714782267183114', type: 'text', group: 'channels' },
  { key: 'TRELLO_CHANNEL_ID', label: 'ID канала Trello', description: 'ID канала для публикации обновлений Trello', defaultValue: '1103248055068528681', type: 'text', group: 'channels' },
  { key: 'VK_CHANNEL_ID', label: 'ID канала VK', description: 'ID канала для постов из VK', defaultValue: '1099230906866188379', type: 'text', group: 'channels' },
  { key: 'VK_LIVE_CHANNEL_ID', label: 'ID канала VK стримов', description: 'ID канала для уведомлений о стримах', defaultValue: '1096038843655032843', type: 'text', group: 'channels' },
  { key: 'VOICE_CHANNEL_CATEGORY_ID', label: 'ID категории голосовых каналов', description: 'ID категории для создания голосовых каналов', defaultValue: '1080068433044615238', type: 'text', group: 'channels' },

  // Группа 5: Числовые параметры
  { key: 'MAX_RETRIES', label: 'Максимум попыток', description: 'Максимальное количество повторных попыток', defaultValue: '3', type: 'number', group: 'numbers' },
  { key: 'PDF_CHECK_INTERVAL', label: 'Интервал проверки PDF (сек)', description: 'Интервал проверки обновлений PDF', defaultValue: '3600', type: 'number', group: 'numbers' },
  { key: 'TELEGRAM_THREAD_ID', label: 'ID ветки Telegram', description: 'ID ветки для отправки сообщений в Telegram', defaultValue: '183', type: 'number', group: 'numbers' },
  { key: 'VK_CHECK_INTERVAL', label: 'Интервал проверки VK (сек)', description: 'Интервал проверки обновлений VK', defaultValue: '300', type: 'number', group: 'numbers' },

  // Группа 6: Текстовые параметры
  { key: 'ACTIVITY_DATABASE_FILE_NAME', label: 'База данных активности', description: 'Файл для хранения данных активности', defaultValue: 'activity.db', type: 'text', group: 'text' },
  { key: 'BAN_DATABASE_FILE_NAME', label: 'База данных банов', description: 'Файл для хранения информации о банах', defaultValue: 'ban.db', type: 'text', group: 'text' },
  { key: 'BIRTHDAYS_FILE_NAME', label: 'Файл дней рождений', description: 'Файл для хранения данных о днях рождениях', defaultValue: 'birthdays.json', type: 'text', group: 'text' },
  { key: 'GREETINGS_FILE_NAME', label: 'Файл приветствий', description: 'Файл с текстами приветствий', defaultValue: 'greetings.json', type: 'text', group: 'text' },
  { key: 'LIVE_DATABASE_FILE_NAME', label: 'База данных стримов', description: 'База данных для отслеживания стримов', defaultValue: 'vk_live.db', type: 'text', group: 'text' },
  { key: 'LOG_FILE_NAME', label: 'Файл логов', description: 'Файл для записи логов работы бота', defaultValue: 'bot.log', type: 'text', group: 'text' },
  { key: 'PDF_CACHE_FILE_NAME', label: 'Кэш PDF', description: 'Файл для кэширования данных PDF', defaultValue: 'pdf_cache.json', type: 'text', group: 'text' },
  { key: 'PDF_MONITOR_URL', label: 'URL мониторинга PDF', description: 'URL для мониторинга PDF документов', defaultValue: 'https://division.inot.pro/', type: 'text', group: 'text' },
  { key: 'SERVER_ID', label: 'ID сервера Discord', description: 'Идентификатор Discord сервера', defaultValue: '835802952521351180', type: 'text', group: 'text' },
  { key: 'TELEGRAM_CACHE_FILE_NAME', label: 'Кэш Telegram', description: 'Файл для кэширования данных Telegram', defaultValue: 'telegram_cache.json', type: 'text', group: 'text' },
  { key: 'TRELLO_CACHE_FILE_NAME', label: 'Кэш Trello', description: 'Файл для кэширования данных Trello', defaultValue: 'trello_cache.json', type: 'text', group: 'text' },
  { key: 'VK_GROUPS', label: 'Группы VK', description: 'Список ID групп VK для мониторинга (через запятую)', defaultValue: '-114642088,-122813847', type: 'text', group: 'text' },
  { key: 'VOICE_CHANNEL_FILE_NAME', label: 'Защищенные голосовые каналы', description: 'Список защищенных голосовых каналов', defaultValue: 'protected_channels_voice.json', type: 'text', group: 'text' },
];

const groupConfig: Record<string, { title: string; description: string; icon: React.ComponentType<any> }> = {
  boolean: {
    title: 'Параметры истина/ложь',
    description: 'Переключатели для включения и отключения функций',
    icon: ToggleLeft,
  },
  timers: {
    title: 'Таймеры и часовой пояс',
    description: 'Настройки времени и задержек',
    icon: Clock,
  },
  roles: {
    title: 'Роли',
    description: 'ID ролей Discord для различных функций',
    icon: Shield,
  },
  channels: {
    title: 'Каналы',
    description: 'ID каналов Discord и других платформ',
    icon: Hash,
  },
  numbers: {
    title: 'Числовые параметры',
    description: 'Различные числовые настройки',
    icon: Calculator,
  },
  text: {
    title: 'Текстовые параметры',
    description: 'Имена файлов и текстовые значения',
    icon: FileText,
  },
};

const ConfigForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const initialData: Record<string, string> = {};
    CONFIG_FIELDS.forEach(field => {
      initialData[field.key] = field.defaultValue;
    });
    return initialData;
  });

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateEnvFile = () => {
    let envContent = '# Конфигурационный файл бота\n';
    envContent += '# Сгенерирован автоматически\n\n';

    const groups = ['boolean', 'timers', 'roles', 'channels', 'numbers', 'text'];
    
    groups.forEach(group => {
      const groupFields = CONFIG_FIELDS.filter(field => field.group === group);
      if (groupFields.length > 0) {
        envContent += `# ${groupConfig[group].title}\n`;
        groupFields.forEach(field => {
          envContent += `${field.key}=${formData[field.key]}\n`;
        });
        envContent += '\n';
      }
    });

    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Файл создан',
      description: 'Файл .env успешно загружен',
    });
  };

  const renderField = (field: ConfigField) => {
    if (field.type === 'boolean') {
      return (
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor={field.key} className="flex-1 cursor-pointer">
            <div className="font-medium">{field.label}</div>
            <div className="text-sm text-muted-foreground">{field.description}</div>
          </Label>
          <Switch
            id={field.key}
            checked={formData[field.key] === 'true'}
            onCheckedChange={(checked) => handleChange(field.key, checked ? 'true' : 'false')}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={field.key}>
          <div className="font-medium">{field.label}</div>
          <div className="text-sm text-muted-foreground">{field.description}</div>
        </Label>
        <Input
          id={field.key}
          type={field.type === 'number' ? 'number' : 'text'}
          value={formData[field.key]}
          onChange={(e) => handleChange(field.key, e.target.value)}
          placeholder={field.defaultValue}
        />
      </div>
    );
  };

  const resetToDefaults = () => {
    const defaultData: Record<string, string> = {};
    CONFIG_FIELDS.forEach(field => {
      defaultData[field.key] = field.defaultValue;
    });
    setFormData(defaultData);
    toast({
      title: 'Сброшено',
      description: 'Все параметры возвращены к значениям по умолчанию',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-6">
          <div className="flex items-center justify-center gap-8">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="font-medium">VKontakte</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ВиКтория
              </h1>
              <p className="text-sm text-muted-foreground mt-1">VK/Discord Bot</p>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
                </svg>
              </div>
              <span className="font-medium">Discord</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto py-8 space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Генератор конфигурации</h2>
          <p className="text-muted-foreground">
            Создайте файл конфигурации для вашего бота ВиКтория. Заполните необходимые поля и скачайте готовый файл настроек.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={resetToDefaults}>
            Сбросить к умолчанию
          </Button>
          <Button onClick={generateEnvFile}>
            Скачать конфигурацию
          </Button>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Параметры <code className="bg-muted px-1 py-0.5 rounded">DISCORD_BOT_TOKEN</code>, <code className="bg-muted px-1 py-0.5 rounded">TELEGRAM_BOT_TOKEN</code> и <code className="bg-muted px-1 py-0.5 rounded">VK_TOKEN</code> добавляются редактированием файла после скачивания. Это решение автора бота. Данные формы никуда не передаются.
          </AlertDescription>
        </Alert>

        {Object.entries(groupConfig).map(([groupKey, config]) => {
          const fields = CONFIG_FIELDS.filter(f => f.group === groupKey);
          if (fields.length === 0) return null;

          const Icon = config.icon;
          
          return (
            <Card key={groupKey}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {config.title}
                </CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map(field => (
                  <div key={field.key}>
                    {renderField(field)}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ConfigForm;
