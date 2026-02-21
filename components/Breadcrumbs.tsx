import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {

    return (
        <nav className="flex items-center gap-1.5 md:gap-2 mb-6 md:mb-8 overflow-hidden whitespace-nowrap">
            <Link 
                to="/" 
                className={`text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors shrink-0 ${items.length > 0 ? 'hidden md:block' : ''}`}
            >
                Home
            </Link>

            {items.length > 1 && (
                <span className="text-zinc-700 text-[10px] md:hidden">...</span>
            )}
            <ChevronRight size={10} className={`text-zinc-700 shrink-0 ${items.length > 0 ? 'hidden md:block' : 'hidden'}`} />
            
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isSecondToLast = index === items.length - 2;
                const showOnMobile = isLast || isSecondToLast;

                return (
                    <React.Fragment key={index}>
                         <ChevronRight 
                            size={10} 
                            className={`text-zinc-700 shrink-0 
                                ${!showOnMobile ? 'hidden md:block' : ''} 
                                ${index === 0 ? 'md:block' : ''}
                            `} 
                        />

                        {item.path && !isLast ? (
                            <Link 
                                to={item.path}
                                className={`text-[10px] uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors shrink-0 
                                    ${!showOnMobile ? 'hidden md:block' : ''}
                                `}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={`text-[10px] uppercase tracking-[0.3em] text-zinc-400 shrink-0 font-medium 
                                ${!showOnMobile ? 'hidden md:block' : ''}
                                ${isLast ? 'truncate max-w-[150px] md:max-w-none text-white' : ''}
                            `}>
                                {item.label}
                            </span>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;
