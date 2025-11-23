"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Globe, Database, User } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useTheme } from "@/context/theme-context"

export default function SettingsPage({ userName }: { userName: string }) {
  const { language, setLanguage, t } = useLanguage()
  const { darkMode, setDarkMode } = useTheme()
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: language,
    timezone: "Europe/Istanbul",
    twoFactorAuth: false,
    dataCollection: true,
    darkMode: darkMode,
  })

  const [profileData, setProfileData] = useState({
    fullName: userName,
    email: "user@example.com",
    phone: "+90 555 123 4567",
  })

  // Language ve darkMode değiştiğinde settings'i güncelle
  useEffect(() => {
    setSettings((prev) => ({ ...prev, language, darkMode }))
  }, [language, darkMode])

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    if (key === "language") {
      setLanguage(value)
    }
    if (key === "darkMode") {
      setDarkMode(value)
    }
  }

  const handleProfileChange = (key: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t("settings.title")}</h1>
          <p className="text-purple-300/70">{t("settings.description")}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600">
              <User className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("settings.profile")}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-purple-600">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("settings.notifications")}</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-purple-600">
              <Lock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("settings.privacy")}</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600">
              <Globe className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{t("settings.system")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t("settings.profileInfo")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-purple-300 mb-2 block">{t("settings.fullName")}</Label>
                    <Input
                      value={profileData.fullName}
                      onChange={(e) => handleProfileChange("fullName", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-purple-300/50"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300 mb-2 block">{t("settings.email")}</Label>
                    <Input
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                      type="email"
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-purple-300/50"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300 mb-2 block">{t("settings.phone")}</Label>
                    <Input
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                      className="bg-slate-700/50 border-purple-500/30 text-white placeholder-purple-300/50"
                    />
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-4">
                    {t("settings.save")}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t("settings.notifications")}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.emailNotif")}</p>
                      <p className="text-purple-300/70 text-sm">{t("settings.emailNotifDesc")}</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.smsNotif")}</p>
                      <p className="text-purple-300/70 text-sm">{t("settings.smsNotifDesc")}</p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(value) => handleSettingChange("smsNotifications", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.pushNotif")}</p>
                      <p className="text-purple-300/70 text-sm">{t("settings.pushNotifDesc")}</p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Privacy & Security Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t("settings.privacy")}</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.twoFactor")}</p>
                      <p className="text-purple-300/70 text-sm">{t("settings.twoFactorDesc")}</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(value) => handleSettingChange("twoFactorAuth", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.dataCollection")}</p>
                      <p className="text-purple-300/70 text-sm">{t("settings.dataCollectionDesc")}</p>
                    </div>
                    <Switch
                      checked={settings.dataCollection}
                      onCheckedChange={(value) => handleSettingChange("dataCollection", value)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-600/10 mt-6 bg-transparent"
                  >
                    {t("settings.changePassword")}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="border-purple-500/30 bg-slate-800/50 backdrop-blur">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">{t("settings.system")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-purple-300 mb-2 block">{t("settings.language")}</Label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange("language", e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 text-white rounded-lg"
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                      <option value="de">Deutsch</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-purple-300 mb-2 block">{t("settings.timezone")}</Label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange("timezone", e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-purple-500/30 text-white rounded-lg"
                    >
                      <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                      <option value="Europe/London">Londra (UTC+0)</option>
                      <option value="Europe/Berlin">Berlin (UTC+1)</option>
                      <option value="Asia/Dubai">Dubai (UTC+4)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-purple-500/20">
                    <div>
                      <p className="text-white font-medium">{t("settings.darkMode")}</p>
                      <p className="text-purple-300/70 text-sm">{settings.darkMode ? "Karanlık mod etkin" : "Açık mod etkin"}</p>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(value) => handleSettingChange("darkMode", value)}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-orange-500/30 text-orange-400 hover:bg-orange-600/10 mt-6 bg-transparent"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {t("settings.exportData")}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
