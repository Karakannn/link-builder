// src/hooks/use-smart-borders.tsx
import { EditorElement, useEditor } from "@/providers/editor/editor-provider";
import { useBorderVisibility } from "@/providers/border-visibility-provider";
import { useMemo, useState, useEffect } from "react";

interface SmartBorderResult {
  shouldShowBorder: boolean;
  borderClass: string;
  level: number;
  isParentSelected: boolean;
  hasSelectedChild: boolean;
  isHovered: boolean;
  elementPath: string[];
}

export const useSmartBorders = (element: EditorElement): SmartBorderResult => {
  const { state } = useEditor();
  const { 
    showBorders, 
    borderLevel, 
    hoveredElementId, 
    focusMode,
    setHoveredElement 
  } = useBorderVisibility();
  
  const [isHovered, setIsHovered] = useState(false);

  // Element hierarchy'sini hesapla
  const hierarchyInfo = useMemo(() => {
    const findElementPath = (
      elements: EditorElement[], 
      targetId: string, 
      currentPath: string[] = []
    ): string[] | null => {
      for (const el of elements) {
        const newPath = [...currentPath, el.id];
        
        if (el.id === targetId) {
          return newPath;
        }
        
        if (Array.isArray(el.content)) {
          const result = findElementPath(el.content, targetId, newPath);
          if (result) return result;
        }
      }
      return null;
    };

    const elementPath = findElementPath(state.editor.elements, element.id);
    const selectedPath = findElementPath(state.editor.elements, state.editor.selectedElement.id);
    
    if (!elementPath) {
      return {
        level: 0,
        elementPath: [],
        isParentSelected: false,
        hasSelectedChild: false,
        isDirectParent: false,
        isDirectChild: false,
      };
    }

    const level = elementPath.length - 1;
    const isParentSelected = selectedPath ? elementPath.some(id => id === state.editor.selectedElement.id) : false;
    const hasSelectedChild = elementPath ? selectedPath?.includes(element.id) : false;
    
    // Direct parent/child relationships
    const isDirectParent = selectedPath ? selectedPath[selectedPath.length - 2] === element.id : false;
    const isDirectChild = elementPath[elementPath.length - 2] === state.editor.selectedElement.id;

    return {
      level,
      elementPath,
      isParentSelected,
      hasSelectedChild,
      isDirectParent,
      isDirectChild,
    };
  }, [element.id, state.editor.elements, state.editor.selectedElement.id]);

  const isSelected = state.editor.selectedElement.id === element.id;
  const isPreviewMode = state.editor.previewMode || state.editor.liveMode;
  const isBodyElement = element.type === "__body";
  const isHoveredElement = hoveredElementId === element.id;

  // Border visibility logic
  const shouldShowBorder = useMemo(() => {
    if (isPreviewMode || !showBorders) return false;
    
    // Body element özel durum
    if (isBodyElement) return isSelected;
    
    // Focus mode - sadece seçili element ve yakınları
    if (focusMode) {
      return isSelected || 
             hierarchyInfo.isDirectParent || 
             hierarchyInfo.isDirectChild ||
             isHoveredElement;
    }
    
    // Normal mode - level kontrolü
    return isSelected || 
           hierarchyInfo.isParentSelected || 
           hierarchyInfo.hasSelectedChild ||
           hierarchyInfo.level <= borderLevel ||
           isHoveredElement;
  }, [
    isPreviewMode, 
    showBorders, 
    isBodyElement, 
    isSelected, 
    focusMode, 
    hierarchyInfo, 
    borderLevel, 
    isHoveredElement
  ]);

  // Border style'ı belirle
  const getBorderClass = () => {
    if (!shouldShowBorder) return '';
    
    // Body element
    if (isBodyElement && isSelected) {
      return 'border-2 border-yellow-400 border-solid';
    }
    
    // Seçili element
    if (isSelected) {
      return 'border-2 border-blue-500 border-solid shadow-blue-500/20 shadow-lg';
    }
    
    // Hover durumu
    if (isHoveredElement) {
      return 'border-2 border-blue-300 border-solid opacity-80';
    }
    
    // Direct parent/child relationships
    if (hierarchyInfo.isDirectParent) {
      return 'border border-green-400 border-dashed opacity-70';
    }
    
    if (hierarchyInfo.isDirectChild) {
      return 'border border-purple-400 border-dashed opacity-70';
    }
    
    // Parent selected
    if (hierarchyInfo.isParentSelected) {
      return 'border border-blue-300 border-dashed opacity-50';
    }
    
    // Has selected child
    if (hierarchyInfo.hasSelectedChild) {
      return 'border border-green-300 border-dashed opacity-60';
    }
    
    // Level'a göre farklı renkler
    const levelStyles = [
      'border border-gray-300 border-dashed opacity-30', // Level 0
      'border border-slate-400 border-dashed opacity-35', // Level 1
      'border border-gray-500 border-dashed opacity-40', // Level 2
      'border border-red-300 border-dashed opacity-45'  // Level 3+
    ];
    
    const styleIndex = Math.min(hierarchyInfo.level, levelStyles.length - 1);
    return `${levelStyles[styleIndex]} hover:opacity-80 hover:border-solid transition-all duration-200`;
  };

  // Mouse event handlers
  useEffect(() => {
    const handleMouseEnter = () => {
      if (!isPreviewMode) {
        setIsHovered(true);
        setHoveredElement(element.id);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (hoveredElementId === element.id) {
        setHoveredElement(null);
      }
    };

    return () => {
      if (hoveredElementId === element.id) {
        setHoveredElement(null);
      }
    };
  }, [element.id, isPreviewMode, hoveredElementId, setHoveredElement]);

  return {
    shouldShowBorder,
    borderClass: getBorderClass(),
    level: hierarchyInfo.level,
    isParentSelected: hierarchyInfo.isParentSelected,
    hasSelectedChild: hierarchyInfo.hasSelectedChild,
    isHovered: isHoveredElement,
    elementPath: hierarchyInfo.elementPath,
  };
};