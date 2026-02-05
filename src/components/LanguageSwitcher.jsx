import { useTranslation } from "react-i18next";
import { FiGlobe } from "react-icons/fi";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                <FiGlobe className="text-lg" />
                <span>
                    {i18n.language === "mr" ? "मराठी" : i18n.language === "hi" ? "हिंदी" : "English"}
                </span>
            </button>

            <div className="absolute right-0 top-full pt-2 w-32 hidden group-hover:block z-50">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => changeLanguage("en")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'en' ? 'text-green-600 font-bold' : 'text-gray-700'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => changeLanguage("mr")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'mr' ? 'text-green-600 font-bold' : 'text-gray-700'}`}
                    >
                        मराठी
                    </button>
                    <button
                        onClick={() => changeLanguage("hi")}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${i18n.language === 'hi' ? 'text-green-600 font-bold' : 'text-gray-700'}`}
                    >
                        हिंदी
                    </button>
                </div>
            </div>
        </div>
    );
}
