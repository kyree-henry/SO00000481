import * as useragent from 'useragent';

 export interface ParsedUserAgent {
  browser: string;
  os: string;
  device: string;
  isMobile: boolean;
  isDesktop: boolean;
}

 
export function parseUserAgent(userAgentString: string): ParsedUserAgent {
  const agent = useragent.parse(userAgentString);

  return {
    browser: agent.toAgent(),   
    os: agent.os,               
    device: agent.device,        
    isMobile: agent.isMobile,    
    isDesktop: !agent.isMobile,  
  };
} 