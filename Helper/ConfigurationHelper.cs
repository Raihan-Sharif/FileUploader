namespace FileUploader.Helper
{
    public class ConfigurationHelper
    {
        public static IConfiguration config;
        public static void Initialize(IConfiguration Configuration)
        {
            config = Configuration;
        }

        public static string Setting(string key)
        {
            return config.GetSection(key).Value;
        }
        public static string[] SettingList(string key)
        {
            return config.GetSection(key).Get<string[]>();
        }
    }
}
