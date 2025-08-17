import { Config, EntityConfig } from '../../source/modules/Config';

describe('Config', () => {
  describe('Config class', () => {
    it('should create with default values', () => {
      const config = new Config();
      
      expect(config.Placeholder).toBe("Search by typing...");
      expect(config.AllowClear).toBe(true);
      expect(config.MinimumInputLength).toBe(3);
      expect(config.Delay).toBe(250);
      expect(config.Multiple).toBeNull();
      expect(config.GroupByField).toBeUndefined();
      expect(config.GroupByEntity).toBeUndefined();
      expect(config.WidthPercent).toBeUndefined();
      expect(config.OptionRenderer).toBeUndefined();
      expect(config.ResultRenderer).toBeUndefined();
    });

    it('should allow setting custom values', () => {
      const config = new Config();
      
      config.Placeholder = "Custom placeholder";
      config.AllowClear = false;
      config.MinimumInputLength = 5;
      config.Delay = 500;
      config.Multiple = true;
      config.GroupByField = "category";
      config.GroupByEntity = true;
      config.WidthPercent = 80;
      
      expect(config.Placeholder).toBe("Custom placeholder");
      expect(config.AllowClear).toBe(false);
      expect(config.MinimumInputLength).toBe(5);
      expect(config.Delay).toBe(500);
      expect(config.Multiple).toBe(true);
      expect(config.GroupByField).toBe("category");
      expect(config.GroupByEntity).toBe(true);
      expect(config.WidthPercent).toBe(80);
    });

    it('should allow setting custom renderers', () => {
      const config = new Config();
      const mockOptionRenderer = jest.fn();
      const mockResultRenderer = jest.fn();
      
      config.OptionRenderer = mockOptionRenderer;
      config.ResultRenderer = mockResultRenderer;
      
      expect(config.OptionRenderer).toBe(mockOptionRenderer);
      expect(config.ResultRenderer).toBe(mockResultRenderer);
    });
  });

  describe('EntityConfig interface', () => {
    it('should define the correct structure', () => {
      const entityConfig: EntityConfig = {
        LogicalName: 'contact',
        DisplayName: 'Contact',
        SetName: 'contacts',
        IdField: 'contactid',
        TextField: 'fullname'
      };
      
      expect(entityConfig.LogicalName).toBe('contact');
      expect(entityConfig.DisplayName).toBe('Contact');
      expect(entityConfig.SetName).toBe('contacts');
      expect(entityConfig.IdField).toBe('contactid');
      expect(entityConfig.TextField).toBe('fullname');
    });
  });
});
